import React, { useState, useEffect } from 'react';
import { StyleSheet, View, RefreshControl, FlatList } from 'react-native';
import { Text, ButtonGroup } from 'react-native-elements';

import Colors from 'constants/Colors';
import { sortBy } from 'src/utils/sorting';
import request from 'src/utils/request';
import {
  getTransactionApplicationsByUserByStatus,
  getTransactionApplicationsByOrganizationByStatus,
} from 'src/graphql/queries';
import TransactionApplicationListItem from './TransactionApplicationListItem';
import { getPropsByStatus } from 'constants/Transaction';

const statusButtons = ['Pending', 'Approved', 'Rejected'].map((key) => {
  return getPropsByStatus(key);
});

export default function TransactionApplicationList({ organizationId, username, onUpdate, lastUpdatedAt }) {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [nextToken, setNextToken] = useState(undefined);

  const load = async (inNextToken) => {
    setIsLoading(true);

    if (username) {
      const { data: { getTransactionApplicationsByUserByStatus: { items, nextToken } } } = await request(getTransactionApplicationsByUserByStatus, {
        username,
        status: {
          eq: statusButtons[selectedIndex].key,
        },
        sortDirection: 'DESC',
        nextToken: inNextToken,
        limit: 10,
      });

      if (inNextToken) {
        setTransactions([...transactions, ...items.sort(sortBy('updatedAt', true))]);
      } else {
        setTransactions(items.sort(sortBy('updatedAt', true)));
      }

      setNextToken(nextToken);
    } else
    if (organizationId) {
      // Admins
      const {
        data: {
          getTransactionApplicationsByOrganizationByStatus: { items, nextToken },
        },
      } = await request(getTransactionApplicationsByOrganizationByStatus, {
        organizationId,
        status: {
          eq: statusButtons[selectedIndex].key,
        },
        sortDirection: 'DESC',
        nextToken: inNextToken,
        limit: 10,
      });

      if (inNextToken) {
        setTransactions([...transactions, ...items.sort(sortBy('updatedAt', true))]);
      } else {
        setTransactions(items.sort(sortBy('updatedAt', true)));
      }

      setNextToken(nextToken);
    }

    setIsLoading(false);
  };

  const renderItem = ({ item }) => (
    <TransactionApplicationListItem
      mode={username ? 'user' : 'admin'}
      transaction={item}
      onUpdate={()=>{
        load();
        if (onUpdate) onUpdate();
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
  }, [organizationId, username, selectedIndex, lastUpdatedAt]);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>申請紀錄</Text> */}
      <ButtonGroup
        onPress={setSelectedIndex}
        selectedIndex={selectedIndex}
        buttons={statusButtons.map(({ label }) => label)}
      />
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
