import React from 'react';
import { StyleSheet, View } from 'react-native';

import UserList from '../components/UserList';

export default function UserListScreen() {
  return (
    <View style={styles.container}>
      <UserList />
    </View>
  );
}

UserListScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
