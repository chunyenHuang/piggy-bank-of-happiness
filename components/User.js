import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar, Text } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

import request from '../src/utils/request';
import { getOrganizationUser } from '../src/graphql/queries';
import AddTaskToUser from './AddTaskToUser';
import UserTaskList from './UserTaskList';
import UserTransactionList from './UserTransactionList';
import WithdrawPointsForUser from './WithdrawPointsForUser';

export default function User({ user: inUser }) {
  const navigation = useNavigation();
  navigation.setOptions({
    title: inUser.name,
  });
  const [user, setUser] = useState({
    tasks: { items: [] },
    transactions: { items: [] },
  });

  const load = async () => {
    const { organizationId, username } = inUser;
    const { data: { getOrganizationUser: userData } } = await request(getOrganizationUser, {
      organizationId,
      username,
    });
    console.log(userData);
    setUser(userData);
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [inUser]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Avatar
          rounded
          size="large"
          source={{ uri: 'https://i.pravatar.cc/300' }}
        />
        <Text h4>{user.currentPoints} 點</Text>
      </View>
      <View style={styles.headerContainer}>
        <WithdrawPointsForUser />
        <AddTaskToUser
          user={user}
          onUpdate={load}
        />
      </View>
      <UserTaskList tasks={user.tasks.items} />
      <UserTransactionList transactions={user.transactions.items} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
});
