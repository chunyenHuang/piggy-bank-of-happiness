import React, { useState, useEffect } from 'react';
import { StyleSheet, View, RefreshControl, FlatList } from 'react-native';
import { Text } from 'react-native-elements';

import Colors from 'constants/Colors';
import { sortBy } from 'src/utils/sorting';
import request from 'src/utils/request';
import { getTransactionApplicationsByUserByCreatedAt } from 'src/graphql/queries';
import TransactionApplicationListItem from './TransactionApplicationListItem';

export default function TransactionApplicationList({ username, onUpdate }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextToken, setNextToken] = useState(undefined);

  const load = async (inNextToken) => {
    if (!username) return;

    setIsLoading(true);

    if (username) {
      const { data: { getTransactionApplicationsByUserByCreatedAt: { items, nextToken } } } = await request(getTransactionApplicationsByUserByCreatedAt, {
        username,
        sortDirection: 'DESC',
        nextToken: inNextToken,
        limit: 10,
      });
      console.log(items);
      if (inNextToken) {
        setTransactions([...transactions, ...items.sort(sortBy('createdAt', true))]);
      } else {
        setTransactions(items.sort(sortBy('createdAt', true)));
      }

      setNextToken(nextToken);
    }

    setIsLoading(false);
  };

  const renderItem = ({ item }) => (
    <TransactionApplicationListItem
      transaction={item}
      onUpdate={()=>{
        load();
        onUpdate();
      }}
    />
  );

  const renderFooter = () => (
    <View style={styles.extraItem}>
      {nextToken === null &&
        <Text style={{ textAlign: 'center', padding: 16, color: Colors.light }}>
          已顯示全部資料
        </Text>}
    </View>
  );

  useEffect(() => {
    load();
  }, [username]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>申請紀錄</Text>
      <FlatList
        ListFooterComponent={renderFooter}
        scrollIndicatorInsets={{ right: 1 }}
        data={transactions}
        renderItem={renderItem}
        keyExtractor={({ id }) => id}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={()=>{
              load();
            }} />
        }
        onEndReached={({ distanceFromEnd })=>{
          if (!isLoading && distanceFromEnd < 0 && nextToken) {
            load(nextToken);
          }
        }}
        onEndReachedThreshold={0}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  extraItem: {
    height: 100,
    textAlign: 'center',
  },
  header: {
    fontSize: 18,
    padding: 16,
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
