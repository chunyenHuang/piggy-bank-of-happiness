import React from 'react';
import { StyleSheet, View } from 'react-native';

import PendingApprovalUserList from '../components/PendingApprovalUserList';

export default function PendingApprovalUserListScreen() {
  return (
    <View style={styles.container}>
      <PendingApprovalUserList />
    </View>
  );
}

PendingApprovalUserListScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
