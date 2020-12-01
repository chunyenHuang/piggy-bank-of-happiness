import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem, Text, Badge } from 'react-native-elements';

import { sortBy } from '../src/utils/sorting';
import Colors from '../constants/Colors';
import { formatDatetime } from 'src/utils/format';

export default function UserTaskList({ tasks = [] }) {
  return (
    <View style={styles.container}>
      <Text h4 h4Style={styles.header}>近期任務</Text>
      {tasks.sort(sortBy('updatedAt', true)).map((task)=>(
        <ListItem
          key={task.id}
          title={task.taskName}
          bottomDivider
        >
          <ListItem.Content>
            <ListItem.Title>{task.taskName}</ListItem.Title>
            <ListItem.Subtitle style={styles.subtitle}>{`${task.status} ${formatDatetime(task.updatedAt)}`}</ListItem.Subtitle>
          </ListItem.Content>
          <Badge {...{
            // status: 'success',
            value: task.points,
            textStyle: styles.badgeText,
            badgeStyle: styles.badge,
          }} />
          <ListItem.Chevron />
        </ListItem>
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
