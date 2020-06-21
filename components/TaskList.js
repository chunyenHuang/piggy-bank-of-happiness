import React, { useEffect, useState } from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { ListItem, Text } from 'react-native-elements';

import request from '../src/utils/request';
import { sortBy } from '../src/utils/sorting';
import { listOrganizationTasks } from '../src/graphql/queries';
import Colors from '../constants/Colors';

export default function TaskList({ mode = 'edit', onSelect }) {
  // const [tasks, setTasks] = useState([]);
  const [programs, setPrograms] = useState([]);

  const handlerPress = (task) => {
    if (mode === 'select') {
      onSelect && onSelect(task);
    }
  };

  useEffect(() => {
    (async () => {
      const params = {
        organizationId: await AsyncStorage.getItem('organizationId'),
        limit: 100,
        filter: {
          isActive: { eq: 1 },
        },
      };
      const { data: { listOrganizationTasks: { items } } } = await request(listOrganizationTasks, params);
      // group by programName
      const programMappings = items.sort(sortBy('name')).reduce((mapping, task) => {
        mapping[task.programName] = mapping[task.programName] || {
          name: task.programName,
          tasks: [],
        };
        mapping[task.programName].tasks.push(task);
        return mapping;
      }, {});

      setPrograms(Object.keys(programMappings).map((key) => programMappings[key]));
    })();
  }, []);
  return (
    <View style={styles.container}>
      {programs.map((program, index)=>(
        <View key={index}>
          <Text h4 h4Style={styles.header}>{program.name}</Text>
          {program.tasks.map((task)=>(
            <ListItem
              key={task.name}
              // leftAvatar={{ source: { uri: randomAvatarUrl } }}
              title={task.name}
              subtitle={task.description}
              subtitleStyle={styles.subtitle}
              bottomDivider
              // chevron
              badge={{
                // status: 'success',
                value: task.pointMin !== task.pointMax ? `${task.pointMin}-${task.pointMax}` : task.point,
                textStyle: styles.badgeText,
                badgeStyle: styles.badge,
              }}
              onPress={() => handlerPress(task)}
            />
          ))}
        </View>
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
