import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { ListItem } from 'react-native-elements';
import { List } from 'react-native-paper';

import { sortBy } from '../src/utils/sorting';
import Colors from '../constants/Colors';
import { listUsersInGroup } from '../src/admin/services';
import ModifyCognitoUser from './ModifyCognitoUser';

export default function CognitoUserList() {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(undefined);

  const load = async () => {
    setIsLoading(true);

    const groupNames = [
      'AppAdmins',
      'OrgAdmins',
      'OrgManagers',
      'Users',
    ];
    const groups = await Promise.all(groupNames.map(async (name) => {
      const { users } = await listUsersInGroup(name);
      return {
        name,
        isExpanded: false,
        users: users
          .map((user) => {
            user.userGroup = name;
            return user;
          })
          .sort(sortBy('custom:organizationName', true)),
      };
    }));
    setGroups(groups);

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
          {groups.map(({ name, users }, index)=>(
            <List.Accordion
              key={index}
              title={`${name} (${users.length})`}
            >
              {users.map((user, index)=>(
                <ListItem
                  key={index}
                  leftAvatar={{ source: { uri: `https://i.pravatar.cc/100?u=${user.username}` } }}
                  title={user.name}
                  subtitle={user.username}
                  subtitleStyle={styles.subtitle}
                  rightTitle={user['custom:organizationName']}
                  rightSubtitle={user.updatedAt}
                  rightSubtitleStyle={styles.subtitle}
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
  },
});
