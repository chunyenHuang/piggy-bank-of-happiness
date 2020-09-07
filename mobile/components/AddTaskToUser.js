import React, { useState, useEffect } from 'react';
import { View, AsyncStorage } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { v1 as uuidv1 } from 'uuid';
import moment from 'moment';
import { Hub } from 'aws-amplify';

import request from '../src/utils/request';
import { createOrganizationUserTask, createOrganizationTransaction, updateOrganizationUser } from '../src/graphql/mutations';
import TaskList from './TaskList';
import Colors from '../constants/Colors';
import CustomModal from './CustomModal';

export default function AddTaskToUser({ user, onUpdate }) {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

  const color = Colors.focused;

  const handleSelect = (task) => {
    if (task.isSelected) {
      tasks.push(task);
    } else {
      const i = tasks.findIndex((x) => x.name === task.name);
      tasks.splice(i, 1);
    }

    setTasks([...tasks]);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    Hub.dispatch('app', { event: 'loading' });

    const { organizationId, username } = user;

    // TODO: Optimize the process
    await tasks.reduce(async (chain, task) => {
      await chain;

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
      global.logger.debug({ currentPoints, earnedPoints });

      // For now, assign and complete the task immediately and then create the transaction for user
      const transactionId = uuidv1();
      const points = task.point;
      const now = moment().toISOString();
      const userTask = {
        organizationId,
        id: uuidv1(),
        taskId: task.id,
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
        createdBy: await AsyncStorage.getItem('app:username'),
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
    }, Promise.resolve());

    Hub.dispatch('app', { event: 'loading-complete' });
    setIsLoading(false);
    setVisible(false);
    onUpdate && onUpdate();
  };

  useEffect(() => {
    if (visible) {
      setTasks([]);
    }
  }, [visible]);

  return (
    <View>
      <Button
        icon={
          <Icon
            name="md-add-circle"
            size={70}
            type='ionicon'
            color={color}
          />
        }
        type="clear"
        onPress={()=>setVisible(true)}
      />

      <CustomModal
        title="指派任務"
        visible={visible}
        onClose={()=>setVisible(false)}
        bottomButtonProps={{
          title: `${tasks.length} 任務 ${tasks.reduce((sum, x) => {
            return sum += x.point;
          }, 0)/100} 點 確認`,
          onPress: ()=> handleSubmit(),
          disabled: tasks.length === 0 || isLoading,
        }}
      >
        <TaskList
          mode="select"
          onSelect={handleSelect}
          disabled={isLoading}
        />
      </CustomModal>
    </View>
  );
}
