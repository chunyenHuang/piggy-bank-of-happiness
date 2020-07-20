import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, AsyncStorage, RefreshControl } from 'react-native';
import { ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { API, graphqlOperation } from 'aws-amplify';

import request from '../src/utils/request';
import { sortBy } from '../src/utils/sorting';
import Colors from '../constants/Colors';
import { onCreateOrganizationUser } from '../src/graphql/subscriptions';

export default function PendingApprovalUserList() {
  const navigation = useNavigation();

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
        role: { eq: 'PendingApproval' },
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
            idNumber
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

    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const subscription = API
      .graphql(graphqlOperation(onCreateOrganizationUser))
      .subscribe({
        next: (event) => {
          if (event) {
            const newUser = event.value.data.onCreateOrganizationUser;
            if (!users.find((x) => x.username === newUser.username)) {
              setUsers([newUser, ...users]);
            }
          }
        },
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [users]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={renderRefreshingControl()}
    >
      {users.map((user, index) => (
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
          subtitle={user.idNumber}
          subtitleStyle={styles.subtitle}
          bottomDivider
          chevron
          // badge={{
          //   // status: 'success',
          //   value: user.currentPoints/100,
          //   textStyle: styles.badgeText,
          //   badgeStyle: styles.badge,
          // }}
          onPress={() => navigation.navigate('User', user)}
        />
      ))
      }
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
