import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Hub } from 'aws-amplify';
import { v1 as uuidv1 } from 'uuid';

import request from '../src/utils/request';
import { adminUpdatePoint, createOrganizationTransactionApplication } from '../src/graphql/mutations';
import TaskList from './TaskList';
import CustomModal from './CustomModal';
import Colors from 'constants/Colors';

export default function AddTaskToUser({ user, isApplication, onUpdate, visible: inVisible, onClose }) {
  const [visible, setVisible] = useState(!!inVisible);
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState([]);

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

    console.log(tasks);

    if (isApplication) {
      await Promise.all(tasks.map(async (task) => {
        const { id, name, point } = task;

        const payload = {
          input: {
            organizationId,
            username,
            status: 'Pending',
            type: 'credits',
            transactionId: uuidv1(),
            taskId: id,
            points: point,
            description: `任務 ${name}`,
            createdBy: username,
            updatedBy: username,
          },
        };

        await request(createOrganizationTransactionApplication, payload);
      }));
    } else {
      const payload = {
        input: {
          organizationId,
          username,
          actions: tasks.map(({ id, name, point }) => {
            return {
              taskId: id,
              taskName: name,
              taskPoints: point,
            };
          }),
        },
      };

      console.log(payload);

      await request(adminUpdatePoint, payload);
    }

    Hub.dispatch('app', { event: 'loading-complete' });
    setIsLoading(false);
    setVisible(false);
    if (onUpdate) onUpdate();
    if (onClose) onClose();
  };

  useEffect(() => {
    if (visible) {
      setTasks([]);
    }
  }, [visible]);

  useEffect(() => {
    if (inVisible) {
      setTasks([]);
      setVisible(inVisible);
    }
  }, [inVisible]);

  return (
    <View>
      <CustomModal
        title="指派任務"
        visible={visible}
        onClose={()=> {
          setVisible(false);
          if (onClose) onClose();
        }}
        bottomButtonProps={{
          title: `${tasks.length} 任務 ${tasks.reduce((sum, x) => {
            return sum += x.point;
          }, 0)/100} 點 確認`,
          onPress: ()=> handleSubmit(),
          disabled: tasks.length === 0 || isLoading,
        }}
        bottomButtonStyle={{ backgroundColor: Colors.alternative }}
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
