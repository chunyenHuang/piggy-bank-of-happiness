import { a } from 'aws-amplify';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';

import TaskList from '../components/TaskList';

export default function TaskListScreen() {
  const [mode, setMode] = useState('edit');

  useEffect(() => {
    (async () => {
      const group = await AsyncStorage.getItem('app:group');
      if (group === 'Users') {
        setMode('none');
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      <TaskList mode={mode}/>
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
