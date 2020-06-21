import React, { useEffect, useState } from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import moment from 'moment';

import Colors from '../constants/Colors';
import { sortBy } from '../src/utils/sorting';

export default function UserTransactionList({ transactions = [] }) {
  return (
    <View style={styles.container}>
      <Text h4 h4Style={styles.header}>近期交易紀錄</Text>
      {transactions.sort(sortBy('updatedAt', true)).map((tx) => (
        <ListItem
          key={tx.id}
          title={`${moment(tx.updatedAt).format('MM/DD/YYYY hh:mm ')} ${tx.note} `}
          bottomDivider
          badge={{
            // status: tx.type === 'credits'? 'success':'default',
            value: tx.points,
            textStyle: styles.badgeText,
            badgeStyle: styles.badge,
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
    fontSize: 10,
    color: Colors.light,
    marginTop: 5,
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
