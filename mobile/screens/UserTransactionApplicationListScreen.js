import React, { useEffect, useState } from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { Icon } from 'react-native-elements';
import { FloatingAction } from 'react-native-floating-action';

import Colors from 'constants/Colors';
import AddRewardToUser from 'components/AddRewardToUser';
import AddTaskToUser from 'components/AddTaskToUser';
import PointsHandler from 'components/PointsHandler';
import TransactionApplicationList from 'components/TransactionApplicationList';

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
    text: '申請提取點數',
    icon: <FabActionIcon name='credit-card' />,
    name: 'btWithdraw',
    color: Colors.raised,
  },
  {
    text: '申請兌換獎品',
    icon: <FabActionIcon name='gift' />,
    name: 'btExchange',
    color: Colors.accent,
  },
  {
    text: '申請任務點數',
    icon: <FabActionIcon name='tasks' />,
    name: 'btAddTask',
  },
].map((item, index) => {
  item.buttonSize = 50;
  item.margin = 3;
  item.position = index + 1;
  return item;
});

export default function UserTransactionApplicationListScreen() {
  const [user, setUser] = useState({});

  const [withdrawVisible, setWithdrawVisible] = useState(false);
  const [addRewardVisible, setAddRewardVisible] = useState(false);
  const [addTaskVisible, setAddTaskVisible] = useState(false);

  const [lastUpdatedAt, setLastUpdatedAt] = useState(Date.now());

  const onWithdrawClose = () => {
    setWithdrawVisible(false);
  };

  const onActionPressed = (button) => {
    switch (button) {
    case 'btAddTask':
      setAddTaskVisible(true);
      return;
    case 'btExchange':
      setAddRewardVisible(true);
      return;
    case 'btWithdraw':
      setWithdrawVisible(true);
      return;
    }
  };

  const load = async () => {
    const { username } = user;

    if (!username) return;

    setLastUpdatedAt(Date.now());
  };

  useEffect(() => {
    load();
  }, [user]);

  useEffect(() => {
    (async () => {
      const [organizationId, username, group] = await Promise.all([
        AsyncStorage.getItem('app:organizationId'),
        AsyncStorage.getItem('app:username'),
        AsyncStorage.getItem('app:group'),
      ]);

      setUser({ organizationId, username, group });
    })();
  }, []);

  if (user.group === 'Users') {
    return (
      <View style={styles.container}>
        <TransactionApplicationList username={user.username} lastUpdatedAt={lastUpdatedAt} />

        <FloatingAction
          actions={actions}
          onPressItem={onActionPressed}
          color={Colors.primary}
        />
        <PointsHandler
          user={user}
          isApplication={true}
          mode={'withdraw'}
          visible={withdrawVisible}
          onClose={onWithdrawClose}
          onUpdate={load}
        />
        <AddRewardToUser
          user={user}
          isApplication={true}
          visible={addRewardVisible}
          onClose={() => setAddRewardVisible(false)}
          onUpdate={load}
        />
        <AddTaskToUser
          user={user}
          isApplication={true}
          visible={addTaskVisible}
          onClose={() => setAddTaskVisible(false)}
          onUpdate={load}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TransactionApplicationList organizationId={user.organizationId}/>
    </View>);
}

UserTransactionApplicationListScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // padding: 8,
  },
  contentContainer: {
    // padding: 8,
    // paddingTop: 30,
  },
});
