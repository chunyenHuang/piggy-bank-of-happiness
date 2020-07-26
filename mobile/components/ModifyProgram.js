import React, { useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import moment from 'moment';
import { v1 as uuidv1 } from 'uuid';

import AddButton from './AddButton';
import CustomModal from './CustomModal';
import Form from './Form';
import request from '../src/utils/request';
import { createOrganizationProgram, updateOrganizationProgram } from '../src/graphql/mutations';
import check from '../src/permission/check';

export default function ModifyProgram({ program: inProgram, hideButton, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [program, setProgram] = useState({});
  const [errors, setErrors] = useState([]);

  const isEditMode = inProgram ? true : false;
  const isActiveTask = isEditMode ? program.isActive : true;

  const handleSubmit = async () => {
    if (isEditMode && !await check('ORG_PG__UPDATE', true)) return;
    if (!isEditMode && !await check('ORG_PG__CREATE', true)) return;

    const errors = fields.map(({ key, required }) => {
      if (required && !program[key]) {
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
      const data = Object.assign(program, {
        organizationId,
        id: uuidv1(),
        isActive: 1,
        createdBy: username,
        createdAt: now,
        updatedAt: now,
      });

      await request(createOrganizationProgram, { input: data });
    } else {
      const data = {
        organizationId,
        id: program.id,
        isActive: program.isActive ? 1 : 0,
        name: program.name,
        description: program.description,
        updatedAt: now,
      };

      await request(updateOrganizationProgram, { input: data });
    }

    resetState();
    onClose && onClose();
  };

  const resetState = () => {
    setIsLoading(false);
    setVisible(false);
    setProgram({});
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
      key: 'name',
      required: true,
      props: {
        label: '任務類別名稱',
        autoCorrect: false,
        disabled: !isActiveTask,
      },
    },
    {
      key: 'description',
      required: false,
      props: {
        label: '任務類別描述',
        autoCorrect: false,
        disabled: !isActiveTask,
      },
    },
  ];

  useEffect(() => {
    if (inProgram) {
      setProgram(Object.assign({}, inProgram, {
        isActive: inProgram.isActive === 1,
      }));
      setVisible(true);
    }
  }, [inProgram]);

  return (
    <React.Fragment>
      {!hideButton &&
        <AddButton
          onPress={async () => {
            if (!await check('ORG_PG__CREATE', true)) return;
            setVisible(true);
          }}
        />}
      <CustomModal
        title={`${isEditMode ? '修改':'新增'}任務類別`}
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
          defaultValue={program}
          onUpdate={(data)=>{
            setProgram(data);
            setIsDirty(true);
          }}
          onSubmit={()=>handleSubmit()}
        />
      </CustomModal>
    </React.Fragment>

  );
}
