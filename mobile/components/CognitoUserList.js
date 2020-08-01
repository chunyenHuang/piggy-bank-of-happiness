import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { ListItem } from 'react-native-elements';
import { List } from 'react-native-paper';

import { sortBy } from 'src/utils/sorting';
import { listUsers, listUsersInGroup } from 'src/admin/services';
import { getGroupNames, getGroupDisplayName } from 'src/admin/utils';
import Colors from 'constants/Colors';

import ModifyCognitoUser from './ModifyCognitoUser';

const groupNames = getGroupNames();

export default function CognitoUserList() {
  const [organizations, setOrganizations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(undefined);


  const load = async () => {
    setIsLoading(true);
    const userGroupMappings = {};

    const [
      allUsers,
    ] = await Promise.all([
      listUsers(true).then(({ data }) => data),
      ...groupNames.map(async (name) => {
        const { data: users } = await listUsersInGroup(name, true);
        users.forEach((user) => {
          userGroupMappings[user.sub] = name;
        });
      }),
    ]);

    const allOrganizations = {};

    allUsers.forEach((user) => {
      const org = user['custom:organizationName'] || 'N/A';
      allOrganizations[org] = allOrganizations[org] || [];

      user.group = getGroupDisplayName(userGroupMappings[user.sub]);
      allOrganizations[org].push(user);
    });

    const orgs = Object.keys(allOrganizations).map((key) => {
      return {
        name: key,
        users: allOrganizations[key].sort(sortBy('name')).sort(sortBy('group')),
      };
    });

    setOrganizations(orgs);

    setIsLoading(false);
  };

  const renderRefreshingControl = () => {
    return (
      <RefreshControl
        refreshing={isLoading}
        onRefresh={load} />
    );
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={styles.container}>
      <ModifyCognitoUser
        user={selectedUser}
        onUpdate={() => load()}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={renderRefreshingControl()}
      >
        <List.Section>
          {organizations.map(({ name, users }, index)=>(
            <List.Accordion
              key={index}
              title={`${name} (${users.length})`}
            >
              {users.map((user, index)=>(
                <ListItem
                  key={index}
                  leftAvatar={{
                    title: `${user.name.substring(0, 1)}`,
                    borderRadius: 25,
                    width: 50,
                    height: 50,
                    color: 'red',
                    backgroundColor: Colors.light,
                    // source: { uri: `https://i.pravatar.cc/100?u=${user.username}` }
                  }}
                  title={user.name}
                  subtitle={user.username}
                  subtitleStyle={styles.subtitle}
                  rightTitle={user.group}
                  rightTitleStyle={styles.subtitle}
                  // rightSubtitle={user.updatedAt}
                  // rightSubtitleStyle={styles.subtitle}
                  bottomDivider
                  chevron
                  badge={{
                    status: user.isVerified?'success':'warning',
                    value: user.currentPoints,
                    textStyle: styles.badgeText,
                    badgeStyle: styles.badge,
                  }}
                  onPress={() => setSelectedUser(user)}
                />
              ))}
            </List.Accordion>
          ))}
        </List.Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 12,
    padding: 12,
    fontSize: 18,
    color: Colors.light,
  },
  subtitle: {
    color: Colors.light,
    paddingTop: 5,
    fontSize: 14,
  },
});
