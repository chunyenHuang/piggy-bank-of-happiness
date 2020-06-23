import React, { useEffect, useState } from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Hub } from 'aws-amplify';

import request from '../src/utils/request';
import { sortBy } from '../src/utils/sorting';

export default function UserList() {
  const navigation = useNavigation();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      Hub.dispatch('app', { event: 'loading' });

      const params = {
        organizationId: await AsyncStorage.getItem('app:organizationId'),
        limit: 100,
        filter: {
          isActive: { eq: 1 },
          role: { eq: 'User' },
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
              currentPoints
              earnedPoints
            }
            nextToken
          }
        }
      `, params);
      setUsers(items.sort(sortBy('name')));

      Hub.dispatch('app', { event: 'loading-complete' });
    })();
  }, []);
  return (
    <View style={styles.container}>
      {users.map((user, index)=>(
        <ListItem
          key={index}
          leftAvatar={{ source: { uri: `https://i.pravatar.cc/100?u=${user.username}` } }}
          title={user.name}
          bottomDivider
          chevron
          // badge={{
          //   // status: 'success',
          //   value: user.currentPoints,
          //   textStyle: styles.badgeText,
          //   badgeStyle: styles.badge,
          // }}
          onPress={() => navigation.navigate('User', user)}
        />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
