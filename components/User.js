import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Text } from 'react-native-elements';
import { Hub } from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';

import request from '../src/utils/request';
import { getOrganizationUser } from '../src/graphql/queries';
import AddTaskToUser from './AddTaskToUser';
import UserTransactionList from './UserTransactionList';
import PointsHandler from './PointsHandler';
import ModifyUser from './ModifyUser';
import { onUpdateOrganizationUser } from '../src/graphql/subscriptions';
import check from '../src/permission/check';
import PointBadge from './PointBadge';
import Colors from '../constants/Colors';

export default function User({ user: inUser, mode }) {
  const [user, setUser] = useState({
    currentPoints: 0,
    tasks: { items: [] },
    transactions: { items: [] },
  });

  const load = async () => {
    Hub.dispatch('app', { event: 'loading' });

    const { organizationId, username } = inUser;
    if (organizationId) {
      const { data: { getOrganizationUser: userData } } = await request(getOrganizationUser, {
        organizationId,
        username,
      });
      console.log('userData', userData);
      userData && setUser(userData);
    } else {
      setUser(inUser);
    }

    Hub.dispatch('app', { event: 'loading-complete' });
  };

  useEffect(() => {
    if (!inUser) return;

    let subscription;
    (async () => {
      await load();

      if (await check('ORG_USER__SUBSCRIPTION')) {
        subscription = API
          .graphql(graphqlOperation(onUpdateOrganizationUser))
          .subscribe({
            next: (event) => {
              if (event) {
                const updatedUser = event.value.data.onUpdateOrganizationUser;
                setUser(updatedUser);
              }
            },
          });
      }
    })();

    return () => {
      subscription && subscription.unsubscribe();
    };
  }, [inUser]);

  const isActive = user.isActive ? true : false;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Avatar
          rounded
          size="large"
          title={user.name && user.name.substring(0, 1)}
          overlayContainerStyle={{ backgroundColor: Colors.light }}
          // source={{ uri: `https://i.pravatar.cc/100?u=${inUser.username}` }}
        />
        <Text h4>{user.name}</Text>
        <PointBadge value={user.currentPoints} />
      </View>
      {mode !== 'view' &&
      <View style={styles.headerContainer}>
        <ModifyUser
          user={user}
          button
        />
        {isActive &&
        <PointsHandler
          user={user}
          mode={'withdraw'}
          onUpdate={load}
        />}
        {/* <PointsHandler
          user={user}
          mode={'adjustment'}
          onUpdate={load}
        /> */}
        {isActive &&
        <AddTaskToUser
          user={user}
          onUpdate={load}
        />}
      </View>}
      {/* <UserTaskList tasks={user.tasks.items} /> */}
      <UserTransactionList
        user={user}
        onUpdate={load}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
});
