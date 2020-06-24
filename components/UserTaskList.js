import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem, Text } from 'react-native-elements';
import moment from 'moment';

import { sortBy } from '../src/utils/sorting';
import Colors from '../constants/Colors';

export default function UserTaskList({ tasks = [] }) {
  return (
    <View style={styles.container}>
      <Text h4 h4Style={styles.header}>近期任務</Text>
      {tasks.sort(sortBy('updatedAt', true)).map((task)=>(
        <ListItem
          key={task.id}
          // leftAvatar={{ source: { uri: randomAvatarUrl } }}
          title={task.taskName}
          subtitle={`${task.status} ${moment(task.updatedAt).format('MM/DD/YYYY hh:mm ')}`}
          subtitleStyle={styles.subtitle}
          bottomDivider
          // chevron
          badge={{
            // status: 'success',
            value: task.points,
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
