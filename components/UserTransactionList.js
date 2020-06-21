import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Text } from 'react-native-elements';

import Colors from '../constants/Colors';
import { sortBy } from '../src/utils/sorting';
import TransactionListItem from './TransactionListItem';

const deviceHeight = Platform.OS === 'ios' ?
  Dimensions.get('window').height :
  require('react-native-extra-dimensions-android').get('REAL_WINDOW_HEIGHT');

export default function UserTransactionList({ transactions = [], onUpdate }) {
  return (
    <View style={styles.container}>
      {/* <Text h4 h4Style={styles.header}>交易紀錄</Text> */}
      {transactions.sort(sortBy('updatedAt', true)).map((tx, index) => (
        <TransactionListItem
          key={index}
          transaction={tx}
          onUpdate={onUpdate}
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
