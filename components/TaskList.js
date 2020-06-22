import React, { useEffect, useState } from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { ListItem, Text, Icon, Slider, Button } from 'react-native-elements';
import { Hub } from 'aws-amplify';
import Modal from 'react-native-modal';

import request from '../src/utils/request';
import { sortBy } from '../src/utils/sorting';
import { listOrganizationTasks } from '../src/graphql/queries';
import Colors from '../constants/Colors';

export default function TaskList({ mode = 'edit', onSelect, disabled = false }) {
  // const [tasks, setTasks] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [task, setTask] = useState(undefined);
  const [newPoint, setNewPoint] = useState(0);
  const [refresh, setRefresh] = useState(Date.now());

  const handlerPress = (task) => {
    if (mode === 'select') {
      onSelect && onSelect(task);
      setRefresh(Date.now());
    }
  };

  useEffect(() => {
    (async () => {
      Hub.dispatch('app', { event: 'loading' });

      const params = {
        organizationId: await AsyncStorage.getItem('app:organizationId'),
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

      Hub.dispatch('app', { event: 'loading-complete' });
    })();
  }, []);
  return (
    <View style={styles.container}>
      {programs.map((program, index)=>(
        <View key={index}>
          <Text style={styles.header}>{program.name}</Text>
          {program.tasks.map((task)=>(
            <ListItem
              key={task.name}
              // leftAvatar={{ source: { uri: randomAvatarUrl } }}
              containerStyle={{ backgroundColor: task.isSelected? Colors.highlight : '#fff' }}
              title={task.name}
              subtitle={task.description}
              subtitleStyle={styles.subtitle}
              bottomDivider
              disabled={disabled}
              // chevron
              leftIcon={mode==='select' ?
                <Icon
                  name={task.isSelected ? 'md-checkbox-outline': 'md-square-outline'}
                  // size={15}
                  type='ionicon'
                  containerStyle={{ paddingRight: 10 }}
                /> : undefined}
              badge={{
                // status: 'success',
                value: (task.pointMin !== task.pointMax && !task.isSelected ? `${task.pointMin/100} - ${task.pointMax/100}` : task.point/100),
                textStyle: styles.badgeText,
                badgeStyle: styles.badge,
              }}
              onPress={() => {
                if (!task.isSelected && task.pointMin !== task.pointMax) {
                  setNewPoint(task.point);
                  setTask(task);
                } else {
                  task.isSelected = !task.isSelected;
                  handlerPress(task);
                }
              }}
            />
          ))}
        </View>
      ))}
      <Modal
        isVisible={task?true:false}
        hardwareAccelerated
        onBackdropPress={()=>setTask(undefined)}
        style={styles.modal}
      >
        {task && <View style={styles.modalContainer}>
          <Text h4 h4Style={{ textAlign: 'center', marginBottom: 10 }}>
            {task.name} ({task.pointMin/100} - {task.pointMax/100} 點)
          </Text>
          <Text h4 h4Style={{ textAlign: 'center' }}>{newPoint/100} 點</Text>
          <Slider
            value={newPoint}
            minimumValue={task.pointMin}
            maximumValue={task.pointMax}
            step={100}
            onValueChange={(value)=>{
              setNewPoint(value);
            }}
            style={{ marginTop: 30, marginBottom: 50 }}
            thumbTouchSize={{ width: 60, height: 60 }}
            thumbTintColor={Colors.primary}
          />
          <Button
            title="確認"
            onPress={() => {
              task.point = newPoint;
              task.isSelected = true;
              handlerPress(task);
              setTask(undefined);
            }}
          />
        </View>}
        <View></View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 12,
    padding: 12,
    fontSize: 18,
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
  modal: {
    flex: 1,
  },
  modalContainer: {
    // flex: 1,
    backgroundColor: '#fff',
    padding: 32,
    height: 300,
  },
});
