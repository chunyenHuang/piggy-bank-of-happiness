import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { Text } from 'react-native-elements';
import { Hub } from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';

import request from '../src/utils/request';
import { getOrganizationUser } from '../src/graphql/queries';
import AddTaskToUser from './AddTaskToUser';
import UserTransactionList from './UserTransactionList';
import PointsHandler from './PointsHandler';
import { onUpdateOrganizationUser } from '../src/graphql/subscriptions';
import check from '../src/permission/check';
import Colors from '../constants/Colors';
import { currency } from '../src/utils/format';
import AddRewardToUser from './AddRewardToUser';
import UserAvatar from 'components/UserAvatar';

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
        <UserAvatar
          username={user.username}
          name={user.name}
          size="large"
          editable
        />
        <View style={styles.headerColumn}>
          <View style={styles.headerRow}>
            <Text h4>{user.name}</Text>
            {!isActive && <Text>(帳號停用中)</Text>}
          </View>
          <View style={styles.headerRow}>
            <View style={styles.pointString}>
              <Text style={styles.pointTitle}>點數</Text>
              <Text style={styles.pointValue}>{currency(user.currentPoints, false)}</Text>
              <Text style={styles.pointTitle}>點</Text>
            </View>
            {isActive && <View style={styles.withdrawButton}>
              <PointsHandler
                user={user}
                mode={'withdraw'}
                onUpdate={load}
              />
            </View>}
            {isActive &&
              <AddRewardToUser
                user={user}
                onUpdate={load}/>}
          </View>
        </View>
      </View>
      <View // draw a line
        style={{
          width: Dimensions.get('window').width,
          borderBottomColor: 'rgba(162,162,162,1)',
          borderBottomWidth: 1,
        }}
      />
      <ScrollView style={styles.transactionList}>
        <UserTransactionList
          user={user}
          onUpdate={load}
        />
      </ScrollView>
      {mode !== 'view' && isActive &&
        <View style={styles.addTaskButton}>
          <AddTaskToUser
            user={user}
            onUpdate={load}
          />
        </View>}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginLeft: 16,
  },
  headerColumn: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 16,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 8,
    height: 80,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointString: {
    flex: 1,
    flexDirection: 'row',
  },
  pointTitle: {
    fontSize: 18,
  },
  pointValue: {
    fontSize: 18,
    color: Colors.focused,
    fontWeight: 'bold',
    marginTop: -2,
  },
  withdrawButton: {
    flex: 1,
    alignItems: 'flex-end',
    marginRight: 16,
  },
  transactionList: {
    flex: 1,
  },
  addTaskButton: {
    position: 'absolute',
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    right: 1,
    bottom: 1,
  },
});
