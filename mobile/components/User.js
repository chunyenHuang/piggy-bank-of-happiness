import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Avatar, Text, Icon } from 'react-native-elements';
import { Hub } from 'aws-amplify';
import { API, graphqlOperation } from 'aws-amplify';
import { FloatingAction } from 'react-native-floating-action';

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

const FabActionIcon = ({ name }) => {
  return (<Icon
    name={name}
    type='font-awesome-5'
    color="#fff"
    size={20}
  />);
};

const actions = [
  {
    text: '提取',
    icon: <FabActionIcon name='credit-card' />,
    name: 'btWithdraw',
    color: Colors.raised,
  },
  {
    text: '兌換',
    icon: <FabActionIcon name='gift' />,
    name: 'btExchange',
    color: Colors.accent,
  },
  {
    text: '指派任務',
    icon: <FabActionIcon name='tasks' />,
    name: 'btAddTask',
  },
].map((item, index) => {
  item.buttonSize = 50;
  item.margin = 3;
  item.position = index + 1;
  return item;
});

export default function User({ user: inUser, mode }) {
  const [user, setUser] = useState({
    currentPoints: 0,
    tasks: { items: [] },
    transactions: { items: [] },
  });
  const [withdrawVisible, setWithdrawVisible] = useState(false);
  const [addTaskVisible, setAddTaskVisible] = useState(false);

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

  const onActionPressed = (button) => {
    switch (button) {
    case 'btAddTask':
      setAddTaskVisible(true);
      return;
    case 'btExchange':

      return;
    case 'btWithdraw':
      setWithdrawVisible(true);
      return;
    }
  };

  const onWithdrawClose = () => {
    setWithdrawVisible(false);
  };

  const onAddTaskClose = () => {
    setAddTaskVisible(false);
  };

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

      <UserTransactionList
        user={user}
      />

      {mode !== 'view' && isActive &&
        <FloatingAction
          actions={actions}
          onPressItem={onActionPressed}
          color={Colors.primary}
        />}

      <PointsHandler
        user={user}
        mode={'withdraw'}
        visible={withdrawVisible}
        onClose={onWithdrawClose}
        onUpdate={load}
      />

      <AddTaskToUser
        user={user}
        visible={addTaskVisible}
        onClose={onAddTaskClose}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
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
