import React from 'react';
import { StyleSheet, View } from 'react-native';
import CognitoUserList from '../components/CognitoUserList';

export default function CognitoUserListScreen() {
  return (
    <View style={styles.container}>
      <CognitoUserList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
