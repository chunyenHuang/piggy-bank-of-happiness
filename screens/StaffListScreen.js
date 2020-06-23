import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import StaffList from '../components/StaffList';

export default function StaffListScreen() {
  return (
    <View style={styles.container}>
      <StaffList />
    </View>
  );
}

StaffListScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
