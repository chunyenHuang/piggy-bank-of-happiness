import React, { useState } from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import { ScrollView } from 'react-native-gesture-handler';
import { v1 as uuidv1 } from 'uuid';
import moment from 'moment';

import request from '../src/utils/request';
import { createOrganizationUserTask, createOrganizationTransaction, updateOrganizationUser } from '../src/graphql/mutations';
import TaskList from './TaskList';
import Colors from '../constants/Colors';

export default function AddTaskToUser({ user, onUpdate }) {
  const [visible, setVisible] = useState(false);

  const handleSelect = async (task) => {
    console.log(user, task);
    setVisible(false);
    const { organizationId, username } = user;

    // pull the latest user record
    const { data: { getOrganizationUser: { currentPoints, earnedPoints } } } = await request( /* GraphQL */ `
      query GetOrganizationUser($organizationId: ID!, $username: String!) {
        getOrganizationUser(organizationId: $organizationId, username: $username) {
          currentPoints
          earnedPoints
        }
      }
    `, {
      organizationId,
      username,
    });
    console.log({ currentPoints, earnedPoints });

    // For now, assign and complete the task immediately and then create the transaction for user
    const transactionId = uuidv1();
    const points = task.point;
    const now = moment().toISOString();
    const userTask = {
      organizationId,
      id: uuidv1(),
      taskName: task.name,
      username,
      status: 'Completed',
      note: 'N/A',
      transactionId,
      points,
      createdAt: now,
      updatedAt: now,
    };
    const transaction = {
      organizationId,
      id: transactionId,
      username,
      points,
      type: 'credits',
      note: task.name,
      createdBy: await AsyncStorage.getItem('username'),
      createdAt: now,
      updatedAt: now,
    };
    const updatedUser = {
      organizationId,
      username,
      currentPoints: currentPoints + points,
      earnedPoints: earnedPoints + points,
      updatedAt: now,
    };
    await Promise.all([
      request(createOrganizationUserTask, { input: userTask }),
      request(createOrganizationTransaction, { input: transaction }),
      request(updateOrganizationUser, { input: updatedUser }),
    ]);

    onUpdate && onUpdate();
  };

  return (
    <View>
      <Button
        icon={
          <Icon
            name="md-add-circle"
            // size={15}
            type='ionicon'
            color={Colors.primary}
            containerStyle={{ paddingRight: 10 }}
          />
        }
        type="clear"
        title="任務"
        titleStyle={{ color: Colors.primary }}
        onPress={()=>setVisible(true)}
      />

      <Modal
        isVisible={visible}
        hardwareAccelerated
        onBackdropPress={()=>setVisible(false)}
      >
        <ScrollView style={styles.modal}>
          {/* TODO: Multiple select */}
          <TaskList
            mode="select"
            onSelect={handleSelect}
          />
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
