import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import TaskList from '../components/TaskList';

export default function TaskListScreen() {
  return (
    <View style={styles.container}>
      <TaskList />
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
