import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, RefreshControl, AsyncStorage } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';

import request from 'src/utils/request';
import { sortBy } from 'src/utils/sorting';
import Colors from 'constants/Colors';
import { getRoleDisplayName } from 'src/admin/utils';

export default function StaffList() {
  const [users, setUsers] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const renderRefreshingControl = () => {
    return (
      <RefreshControl
        refreshing={isLoading}
        onRefresh={load} />
    );
  };

  const load = async () => {
    setIsLoading(true);

    const params = {
      organizationId: await AsyncStorage.getItem('app:organizationId'),
      limit: 100,
      filter: {
        or: [{
          role: { eq: 'Admin' },
        }, {
          role: { eq: 'Manager' },
        }],
      },
    };
    const { data: { listOrganizationUsers: { items } } } = await request( /* GraphQL */ `
      query ListOrganizationUsers(
        $organizationId: ID
        $username: ModelStringKeyConditionInput
        $filter: ModelOrganizationUserFilterInput
        $limit: Int
        $nextToken: String
        $sortDirection: ModelSortDirection
      ) {
        listOrganizationUsers(
          organizationId: $organizationId
          username: $username
          filter: $filter
          limit: $limit
          nextToken: $nextToken
          sortDirection: $sortDirection
        ) {
          items {
            organizationId
              username
              name
              role
              isActive
          }
          nextToken
        }
      }
    `, params);
    setUsers(items.sort(sortBy('name')));

    setIsLoading(false);
  };
  useEffect(() => {
    load();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={renderRefreshingControl()}
    >
      {users.map((user, index)=>(
        <ListItem
          key={index}
          bottomDivider
        >
          <Avatar {...{
            title: `${user.name.substring(0, 1)}`,
            borderRadius: 25,
            width: 50,
            height: 50,
            backgroundColor: Colors.light,
            // source: { uri: `https://i.pravatar.cc/100?u=${user.username}` }
          }} />
          <ListItem.Content>
            <ListItem.Title>{user.name}</ListItem.Title>
            <ListItem.Subtitle style={styles.subtitle}>{user.username}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Title>{getRoleDisplayName(user.role)}</ListItem.Title>
        </ListItem>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    color: Colors.light,
    paddingTop: 5,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 16,
  },
  badge: {
    height: 25,
    padding: 5,
  },
});
