import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import RewardList from 'components/RewardList';

export default function TaskListScreen() {
  return (
    <View style={styles.container}>
      <RewardList />
    </View>
  );
}

TaskListScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
