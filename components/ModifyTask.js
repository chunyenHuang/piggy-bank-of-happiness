import React, { useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import moment from 'moment';

import AddButton from './AddButton';
import CustomModal from './CustomModal';
import Form from './Form';
import request from '../src/utils/request';
import { createOrganizationTask, updateOrganizationTask } from '../src/graphql/mutations';
import check from '../src/permission/check';

export default function ModifyTask({ task: inTask, hideButton, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [task, setTask] = useState({});
  const [errors, setErrors] = useState([]);

  const isEditMode = inTask ? true : false;
  const isActiveTask = isEditMode ? task.isActive : true;

  const handleSubmit = async () => {
    if (isEditMode && !await check('ORG_TX__UPDATE', true)) return;
    if (!isEditMode && !await check('ORG_TX__CREATE', true)) return;

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

    if (!isEditMode) {
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
        isActive: task.isActive ? 1 : 0,
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

    resetState();
    onClose && onClose();
  };

  const resetState = () => {
    setIsLoading(false);
    setVisible(false);
    setTask({});
    setIsDirty(false);
  };

  const fields = [
    {
      key: 'isActive',
      props: {
        enabledLabel: '使用中',
        disabledLabel: '停用中',
        hidden: !isEditMode,
      },
      type: 'switch',
    },
    {
      key: 'programName',
      required: true,
      props: {
        label: '類別',
        autoCorrect: false,
        autoCapitalize: 'none',
        placeholder: 'ex: 學校表現 日常工作',
        disabled: !isActiveTask,
      },
    },
    {
      key: 'name',
      required: true,
      props: {
        label: '任務名稱',
        autoCorrect: false,
        disabled: isEditMode,
      },
    },
    {
      key: 'description',
      required: true,
      props: {
        label: '任務內容',
        autoCorrect: false,
        disabled: !isActiveTask,
      },
    },
    {
      key: 'point',
      required: true,
      props: {
        label: '點數',
        keyboardType: 'number-pad',
        disabled: !isActiveTask,
      },
    },
    {
      key: 'pointMin',
      props: {
        label: '最低點數 (選填)',
        keyboardType: 'number-pad',
        disabled: !isActiveTask,
      },
    },
    {
      key: 'pointMax',
      props: {
        label: '最高點數 (選填)',
        keyboardType: 'number-pad',
        disabled: !isActiveTask,
      },
    },
  ];

  useEffect(() => {
    if (inTask) {
      setTask(Object.assign({}, inTask, {
        point: `${inTask.point / 100}`,
        pointMin: `${inTask.pointMin / 100}`,
        pointMax: `${inTask.pointMax / 100}`,
        isActive: inTask.isActive === 1,
      }));
      setVisible(true);
    }
  }, [inTask]);

  return (
    <React.Fragment>
      {!hideButton &&
        <AddButton
          onPress={async () => {
            if (!await check('ORG_TX__CREATE', true)) return;
            setVisible(true);
          }}
        />}
      <CustomModal
        title={`${isEditMode ? '修改':'新增'}任務`}
        visible={visible}
        onClose={() => {
          resetState();
          onClose && onClose();
        }}
        padding
        autoFocus={false}
        bottomButtonProps={{
          title: `確認`,
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
