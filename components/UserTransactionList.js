import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Text } from 'react-native-elements';

import Colors from '../constants/Colors';
import { sortBy } from '../src/utils/sorting';
import TransactionListItem from './TransactionListItem';
import request from '../src/utils/request';
import { getTransactionsByUserByCreatedAt } from '../src/graphql/queries';

const deviceHeight = Platform.OS === 'ios' ?
  Dimensions.get('window').height :
  require('react-native-extra-dimensions-android').get('REAL_WINDOW_HEIGHT');

export default function UserTransactionList({ user = {}, onUpdate }) {
  const [transactions, setTransactions] = useState([]);

  const load = async () => {
    const { username } = user;

    if (!username) return;

    const { data: { getTransactionsByUserByCreatedAt: { items } } } = await request(getTransactionsByUserByCreatedAt, {
      username,
      sortDirection: 'DESC',
      limit: 20,
    });

    setTransactions(items);
  };

  useEffect(() => {
    load();
  }, [user]);

  return (
    <View style={styles.container}>
      {/* <Text h4 h4Style={styles.header}>交易紀錄</Text> */}
      {transactions.sort(sortBy('updatedAt', true)).map((tx, index) => (
        <TransactionListItem
          key={index}
          transaction={tx}
          onUpdate={()=>{
            load();
            onUpdate();
          }}
        />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    margin: 20,
    textAlign: 'center',
    color: Colors.light,
  },
  subtitle: {
    color: Colors.light,
    marginTop: 5,
  },
  rightTitle: {
    fontSize: 20,
  },
  modal: {
    flex: 1,
    margin: 0,
    marginTop: deviceHeight / 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 32,
  },
});
