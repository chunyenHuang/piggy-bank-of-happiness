import React, { useEffect, useState } from 'react';
import { StyleSheet, View, AsyncStorage, RefreshControl, ScrollView } from 'react-native';
import { ListItem, Text, Icon, Slider, Button, Badge } from 'react-native-elements';
import { List } from 'react-native-paper';
import { Hub } from 'aws-amplify';
import Modal from 'react-native-modal';
import { API, graphqlOperation } from 'aws-amplify';

import { asyncListAll } from 'src/utils/request';
import { sortBy } from 'src/utils/sorting';
import { getOrgTasksByProgramByActive, listOrganizationPrograms } from 'src/graphql/queries';
import Colors from 'constants/Colors';
import { onCreateOrganizationTask, onUpdateOrganizationTask } from 'src/graphql/subscriptions';
import ModifyTask from './ModifyTask';
import check from 'src/permission/check';
import BadgeInactive from 'components/BadgeInactive';

export default function TaskList({ mode = 'edit', onSelect, disabled = false }) {
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
    if (mode === 'edit') setIsLoading(true);
    if (mode === 'select') Hub.dispatch('app', { event: 'loading' });

    const programParams = {
      organizationId: await AsyncStorage.getItem('app:organizationId'),
      filter: {
        isActive: { eq: 1 },
      },
    };

    const programs = await asyncListAll(listOrganizationPrograms, programParams);
    const promises = await programs.map(async (program) => {
      const taskParams = {
        programId: program.id,
      };
      if (mode === 'select') {
        taskParams.isActive = { eq: 1 };
      }
      const tasks = await asyncListAll(getOrgTasksByProgramByActive, taskParams);
      program.tasks = tasks;
      program.isExpanded = true;
    });
    await Promise.all(promises);

    setPrograms(programs);

    if (mode === 'edit') setIsLoading(false);
    if (mode === 'select') Hub.dispatch('app', { event: 'loading-complete' });
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, []);

  useEffect(() => {
    let subscriptionCreate;
    let subscriptionUpdate;

    (async () => {
      if (!await check('ORG_TSK__SUBSCRIPTION')) return;

      subscriptionCreate = API
        .graphql(graphqlOperation(onCreateOrganizationTask))
        .subscribe({
          next: (event) => {
            if (event) {
              const newTask = event.value.data.onCreateOrganizationTask;
              const matchedProgram = programs.find(({ id }) => id === newTask.programId);
              if (matchedProgram) {
                matchedProgram.tasks.unshift(newTask);
                setPrograms([...programs]);
              } else {
                load();
              }
            }
          },
        });
      subscriptionUpdate = API
        .graphql(graphqlOperation(onUpdateOrganizationTask))
        .subscribe({
          next: (event) => {
            if (event) {
              const updatedTask = event.value.data.onUpdateOrganizationTask;
              // remove the original one first if found
              programs.some((program) => {
                const matchedTaskIndex = program.tasks.findIndex((x) => x.name === updatedTask.name);
                if (matchedTaskIndex !== -1) {
                  program.tasks.splice(matchedTaskIndex, 1);
                  return true;
                }
                return false;
              });
              const matchedProgram = programs.find(({ id }) => id === updatedTask.progrmId);
              if (matchedProgram) {
                matchedProgram.tasks.push(updatedTask);
                setPrograms([...programs]);
              } else {
                load();
              }
            }
          },
        });
    })();

    return () => {
      if (subscriptionCreate) subscriptionCreate.unsubscribe();
      if (subscriptionUpdate) subscriptionUpdate.unsubscribe();
    };
  }, [programs]);

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
          onClose={() => setTask(undefined)}
        />}
      <List.Section>
        {programs.map((program, index)=>(
          <List.Accordion
            key={index}
            title={`${program.name} (${program.tasks.length})`}
            description={program.description}
            descriptionStyle={{ marginTop: 10, fontSize: 12 }}
            expanded={program.isExpanded}
            onPress={()=>{
              program.isExpanded = !program.isExpanded;
              setPrograms([...programs]);
            }}
          >
            {program.tasks.sort(sortBy('name', true)).sort(sortBy('isActive', true)).map((task, taskIndex)=>(
              <ListItem
                key={taskIndex}
                containerStyle={{ backgroundColor: task.isSelected? Colors.highlight : '#fff' }}
                bottomDivider
                disabled={disabled}
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
              >
                {mode === 'select' &&
                  <Icon
                    name={task.isSelected ? 'md-checkbox-outline': 'md-square-outline'}
                    // size={15}
                    type='ionicon'
                    containerStyle={{ paddingRight: 10 }}
                  />}
                <ListItem.Content>
                  <ListItem.Title>{task.name}</ListItem.Title>
                  {(task.description ? true : false) &&
                    <ListItem.Subtitle style={styles.subtitle}>{task.description}</ListItem.Subtitle>}
                </ListItem.Content>
                {!task.isActive && <BadgeInactive />}
                <Badge
                  {...{
                    value: (task.pointMin !== task.pointMax && !task.isSelected ? `${task.pointMin/100} - ${task.pointMax/100}` : task.point / 100),
                    textStyle: styles.badgeTextActive,
                    badgeStyle: styles.badgeActive,
                  }}
                />
                {mode === 'edit' &&
                  <ListItem.Chevron />}
              </ListItem>
            ))}
          </List.Accordion>
        ))}
      </List.Section>
      <Modal
        isVisible={ mode ==='select' && task ? true:false }
        hardwareAccelerated
        onBackdropPress={() => {}}
        style={styles.modal}
      >
        {(task ? true : false) && <View style={styles.modalContainer}>
          <Text h4 h4Style={{ textAlign: 'center', marginBottom: 10 }}>
            {task.name}
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
            thumbTouchSize={{ width: 100, height: 100 }}
            thumbTintColor={Colors.alternative}
            thumbStyle={styles.thumb}
          />
          <View style={styles.pointsRangeContainer}>
            <Text>{task.pointMin/100}</Text>
            <Text>{task.pointMax/100}</Text>
          </View>
          <View style={styles.actionContainer}>
            <Button
              title="取消"
              type="clear"
              titleStyle={{ color: Colors.alternative }}
              buttonStyle={styles.button}
              onPress={() => {
                setTask(undefined);
              }}
            />
            <Button
              title="確認"
              buttonStyle={{ ...styles.button, backgroundColor: Colors.alternative }}
              onPress={() => {
                task.point = newPoint;
                task.isSelected = true;
                handlerPress(task);
                setTask(undefined);
              }}
            />
          </View>
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
  badgeActive: {
    height: 25,
    padding: 5,
    backgroundColor: Colors.alternative,
  },
  modal: {
    flex: 1,
  },
  modalContainer: {
    // flex: 1,
    backgroundColor: '#fff',
    padding: 32,
    // height: 360,
    borderRadius: 20,
  },
  thumb: {
    width: 30,
    height: 30,
    borderRadius: 50,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 1,
  },
  pointsRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: -50,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 50,
  },
  button: {
    paddingLeft: 32,
    paddingRight: 32,
  },
});
