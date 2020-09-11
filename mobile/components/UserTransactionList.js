import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';

import Colors from '../constants/Colors';
import { sortBy } from '../src/utils/sorting';
import TransactionListItem from './TransactionListItem';
import request from '../src/utils/request';
import { getTransactionsByUserByCreatedAt } from '../src/graphql/queries';

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
      <Text style={styles.header}>交易紀錄</Text>
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
    fontSize: 18,
    marginLeft: 16,
    marginTop: 16,
    textAlign: 'left',
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
    marginTop: 100,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 32,
  },
});
