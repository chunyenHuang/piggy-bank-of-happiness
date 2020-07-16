import React, { useEffect, useState } from 'react';
import { StyleSheet, View, AsyncStorage, RefreshControl, ScrollView } from 'react-native';
import { ListItem, Text, Icon, Slider, Button } from 'react-native-elements';
import { List } from 'react-native-paper';
import { Hub } from 'aws-amplify';
import Modal from 'react-native-modal';
import { API, graphqlOperation } from 'aws-amplify';

import request from '../src/utils/request';
import { sortBy } from '../src/utils/sorting';
import { listOrganizationTasks } from '../src/graphql/queries';
import Colors from '../constants/Colors';
import { onCreateOrganizationTask, onUpdateOrganizationTask } from '../src/graphql/subscriptions';
import ModifyTask from './ModifyTask';
import check from '../src/permission/check';

export default function TaskList({ mode = 'edit', onSelect, disabled = false }) {
  // const [tasks, setTasks] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [task, setTask] = useState(undefined);
  const [newPoint, setNewPoint] = useState(0);
  const [refresh, setRefresh] = useState(Date.now());
  const [isLoading, setIsLoading] = useState(false);

  global.logger.debug(refresh);

  const handlerPress = (task) => {
    if (mode === 'select') {
      onSelect && onSelect(task);
      setRefresh(Date.now());
    }
  };

  const renderRefreshingControl = () => {
    return (
      <RefreshControl
        refreshing={isLoading}
        onRefresh={load} />
    );
  };

  const load = async () => {
    mode === 'edit' && setIsLoading(true);
    mode === 'select' && Hub.dispatch('app', { event: 'loading' });

    const params = {
      organizationId: await AsyncStorage.getItem('app:organizationId'),
      limit: 100, // TODO: need to handle task more than 100
    };
    if (mode === 'select') {
      params.filter = {
        isActive: { eq: 1 },
      };
    }
    const { data: { listOrganizationTasks: { items } } } = await request(listOrganizationTasks, params);
    // group by programName
    const programMappings = items.sort(sortBy('programName')).reduce((mapping, task, index) => {
      mapping[task.programName] = mapping[task.programName] || {
        name: task.programName,
        isExpanded: index === 0 ? true : false,
        tasks: [],
      };
      mapping[task.programName].tasks.push(task);
      return mapping;
    }, {});

    setPrograms(Object.keys(programMappings).map((key) => programMappings[key]));

    mode === 'edit' && setIsLoading(false);
    mode === 'select' && Hub.dispatch('app', { event: 'loading-complete' });
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    let subscriptionCreate;
    let subscriptionUpdate;

    (async () => {
      if (!await check('ORG_TX__SUBSCRIPTION')) return;

      subscriptionCreate = API
        .graphql(graphqlOperation(onCreateOrganizationTask))
        .subscribe({
          next: (event) => {
            if (event) {
              const newTask = event.value.data.onCreateOrganizationTask;
              const matchedProgram = programs.find((x) => x.name === newTask.programName);
              if (matchedProgram) {
                matchedProgram.tasks.unshift(newTask);
              } else {
                programs.unshift({
                  name: newTask.programName,
                  tasks: [newTask],
                  isExpanded: true,
                });
              }
              setPrograms([...programs]);
            }
          },
        });
      subscriptionUpdate = API
        .graphql(graphqlOperation(onUpdateOrganizationTask))
        .subscribe({
          next: (event) => {
            if (event) {
              const updatedTask = event.value.data.onUpdateOrganizationTask;
              console.log(updatedTask);
              const matchedProgram = programs.find((x) => x.name === updatedTask.programName);
              if (matchedProgram) {
                const matchedTask = matchedProgram.tasks.find((x) => x.name === updatedTask.name);
                Object.assign(matchedTask, updatedTask);
              } else {
                programs.unshift({
                  name: updatedTask.programName,
                  tasks: [updatedTask],
                  isExpanded: true,
                });
              }
              setPrograms([...programs]);
            }
          },
        });
    })();

    return () => {
      subscriptionCreate && subscriptionCreate.unsubscribe();
      subscriptionUpdate && subscriptionUpdate.unsubscribe();
    };
  }, [programs]);

  const getBadge = (task) => {
    if (task.isActive) {
      return {
        value: (task.pointMin !== task.pointMax && !task.isSelected ? `${task.pointMin/100} - ${task.pointMax/100}` : task.point/100),
        textStyle: styles.badgeTextActive,
        badgeStyle: styles.badgeActive,
      };
    } else {
      return {
        value: '停用中',
        textStyle: styles.badgeTextInactive,
        badgeStyle: styles.badgeInactive,
      };
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={renderRefreshingControl()}
    >
      {mode === 'edit' &&
        <ModifyTask
          hideButton={true}
          task={task}
          onClose={()=>setTask(undefined)}
        />}
      <List.Section>
        {programs.map((program, index)=>(
          <List.Accordion
            key={index}
            title={`${program.name} (${program.tasks.length})`}
            expanded={program.isExpanded}
            onPress={()=>{
              program.isExpanded = !program.isExpanded;
              setPrograms([...programs]);
            }}
          >
            {program.tasks.sort(sortBy('name')).sort(sortBy('isActive', true)).map((task)=>(
              <ListItem
                key={task.name}
                // leftAvatar={{ source: { uri: randomAvatarUrl } }}
                containerStyle={{ backgroundColor: task.isSelected? Colors.highlight : '#fff' }}
                title={task.name}
                subtitle={task.description}
                subtitleStyle={styles.subtitle}
                bottomDivider
                disabled={disabled}
                chevron={mode === 'edit'}
                leftIcon={mode==='select' ?
                  <Icon
                    name={task.isSelected ? 'md-checkbox-outline': 'md-square-outline'}
                    // size={15}
                    type='ionicon'
                    containerStyle={{ paddingRight: 10 }}
                  /> : undefined}
                badge={getBadge(task)}
                onPress={() => {
                  if (mode === 'select') {
                    if (!task.isSelected && task.pointMin !== task.pointMax) {
                      setNewPoint(task.point);
                      setTask(task);
                    } else {
                      task.isSelected = !task.isSelected;
                      handlerPress(task);
                    }
                  } else
                  if (mode === 'edit') {
                    setTask(task);
                  }
                }}
              />
            ))}
          </List.Accordion>
        ))}
      </List.Section>
      <Modal
        isVisible={ mode ==='select' && task?true:false }
        hardwareAccelerated
        onBackdropPress={() => {}}
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
          <Button
            title="取消"
            type="clear"
            style={{ marginTop: 20 }}
            onPress={() => {
              setTask(undefined);
            }}
          />
        </View>}
        <View></View>
      </Modal>
    </ScrollView>
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
  badgeTextActive: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 16,
  },
  badgeTextInactive: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 16,
  },
  badgeActive: {
    height: 25,
    padding: 5,
  },
  badgeInactive: {
    height: 25,
    padding: 5,
    backgroundColor: '#767577',
  },
  modal: {
    flex: 1,
  },
  modalContainer: {
    // flex: 1,
    backgroundColor: '#fff',
    padding: 32,
    height: 360,
    borderRadius: 20,
  },
});
