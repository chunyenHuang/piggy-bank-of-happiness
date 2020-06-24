import React, { useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import moment from 'moment';

import AddButton from './AddButton';
import CustomModal from './CustomModal';
import Form from './Form';
import request from '../src/utils/request';
import { createOrganizationTask, updateOrganizationTask } from '../src/graphql/mutations';

export default function ModifyTask({ task: inTask, hideButton, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [task, setTask] = useState({});
  const [errors, setErrors] = useState([]);

  const isModified = inTask ? true : false;

  const handleSubmit = async () => {
    const errors = fields.map(({ key, required }) => {
      if (required && !task[key]) {
        return '必填';
      } else {
        return;
      }
    });

    if (errors.filter((x) => x).length !== 0) {
      setErrors([...errors]);
      return;
    }

    setIsLoading(true);
    const organizationId = await AsyncStorage.getItem('app:organizationId');
    const username = await AsyncStorage.getItem('app:username');
    const now = moment().toISOString();

    if (!isModified) {
      const data = Object.assign(task, {
        organizationId,
        isActive: 1,
        point: parseInt(task.point) * 100,
        pointMin: parseInt(task.pointMin || task.point) * 100,
        pointMax: parseInt(task.pointMax || task.point) * 100,
        createdBy: username,
        createdAt: now,
        updatedAt: now,
      });

      await request(createOrganizationTask, { input: data });
    } else {
      const data = {
        organizationId,
        name: task.name,
        programName: task.programName,
        description: task.description,
        point: parseInt(task.point) * 100,
        pointMin: parseInt(task.pointMin || task.point) * 100,
        pointMax: parseInt(task.pointMax || task.point) * 100,
        updatedAt: now,
      };

      await request(updateOrganizationTask, { input: data });
    }

    setIsLoading(false);
    setVisible(false);
    setTask({});
    onClose && onClose();
  };

  const fields = [
    {
      key: 'programName',
      required: true,
      props: {
        label: '類別',
        autoCorrect: false,
        autoCapitalize: 'none',
        placeholder: 'ex: 學校表現 日常工作',
      },
    },
    {
      key: 'name',
      required: true,
      props: {
        label: '任務名稱',
        autoCorrect: false,
      },
    },
    {
      key: 'description',
      required: true,
      props: {
        label: '任務內容',
        autoCorrect: false,
      },
    },
    {
      key: 'point',
      required: true,
      props: {
        label: '點數',
        keyboardType: 'number-pad',
      },
    },
    {
      key: 'pointMin',
      props: {
        label: '最低點數 (選填)',
        keyboardType: 'number-pad',
      },
    },
    {
      key: 'pointMax',
      props: {
        label: '最高點數 (選填)',
        keyboardType: 'number-pad',
      },
    },
  ];

  useEffect(() => {
    if (inTask) {
      setTask(Object.assign({}, inTask, {
        point: `${inTask.point / 100}`,
        pointMin: `${inTask.pointMin / 100}`,
        pointMax: `${inTask.pointMax / 100}`,
      }));
      setVisible(true);
    }
  }, [inTask]);

  return (
    <React.Fragment>
      {!hideButton &&
        <AddButton
          onPress={() => setVisible(true)}
        />}
      <CustomModal
        visible={visible}
        onClose={() => setVisible(false)}
        padding
        bottomButtonProps={{
          title: `${isModified ? '修改':'新增'}任務`,
          onPress: ()=> handleSubmit(),
          disabled: !isDirty || isLoading,
        }}
      >
        <Form
          fields={fields}
          errors={errors}
          defaultValue={task}
          onUpdate={(data)=>{
            setTask(data);
            setIsDirty(true);
          }}
          onSubmit={()=>handleSubmit()}
        />
      </CustomModal>
    </React.Fragment>

  );
}
