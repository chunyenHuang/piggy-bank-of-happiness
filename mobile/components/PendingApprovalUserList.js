import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, AsyncStorage, RefreshControl } from 'react-native';
import { ListItem } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { API, graphqlOperation } from 'aws-amplify';

import { asyncListAll } from 'src/utils/request';
import { sortBy } from 'src/utils/sorting';
import Colors from 'constants/Colors';
import { getOrgUsersByRoleByOrg } from 'src/graphql/queries';
import { onCreateOrganizationUser, onUpdateOrganizationUser } from 'src/graphql/subscriptions';
import UserAvatar from 'components/UserAvatar';

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
      role: 'PendingApproval',
      organizationId: { eq: await AsyncStorage.getItem('app:organizationId') },
    };
    const items = await asyncListAll(getOrgUsersByRoleByOrg, params);
    setUsers(items.sort(sortBy('name')));

    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const subscriptionCreate = API
      .graphql(graphqlOperation(onCreateOrganizationUser))
      .subscribe({
        next: (event) => {
          if (event) {
            load();
          }
        },
      });

    const subscriptionUpdate = API
      .graphql(graphqlOperation(onUpdateOrganizationUser))
      .subscribe({
        next: (event) => {
          if (event) {
            load();
          }
        },
      });

    return () => {
      subscriptionCreate.unsubscribe();
      subscriptionUpdate.unsubscribe();
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
          bottomDivider
          onPress={() => navigation.navigate('Stacks', { screen: 'User', params: user })}
        >
          <UserAvatar
            username={user.username}
            name={`${user.name}`}
          />
          <ListItem.Content>
            <ListItem.Title>{user.name}</ListItem.Title>
            <ListItem.Subtitle style={styles.subtitle}>{user.idNumber}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
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
