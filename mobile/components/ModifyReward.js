import React, { useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import moment from 'moment';
import { v1 as uuidv1 } from 'uuid';

import AddButton from './AddButton';
import CustomModal from './CustomModal';
import Form from './Form';
import request from '../src/utils/request';
import { createOrganizationReward, updateOrganizationReward } from '../src/graphql/mutations';
import check from '../src/permission/check';
import RewardAvatar from 'components/RewardAvatar';

export default function ModifyTask({ item: inItem, hideButton, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [reward, setReward] = useState({});
  const [errors, setErrors] = useState([]);

  const isEditMode = inItem ? true : false;
  const isActiveReward = isEditMode ? reward.isActive : true;

  const handleSubmit = async () => {
    if (isEditMode && !await check('ORG_RWD__UPDATE', true)) return;
    if (!isEditMode && !await check('ORG_RWD__CREATE', true)) return;

    const errors = fields.map(({ key, required }) => {
      if (required && !reward[key]) {
        return '必填';
      }

      return;
    });

    if (errors.filter((x) => x).length !== 0) {
      setErrors([...errors]);
      return;
    }

    setIsLoading(true);
    const username = await AsyncStorage.getItem('app:username');
    const now = moment().toISOString();

    if (!isEditMode) {
      const data = Object.assign(reward, {
        organizationId: reward.organizationId,
        id: reward.id,
        isActive: 1,
        requiredPoints: parseFloat(reward.requiredPoints) * 100,
        total: parseInt(reward.total),
        createdBy: username,
        createdAt: now,
        updatedAt: now,
      });

      await request(createOrganizationReward, { input: data });
    } else {
      const data = {
        organizationId: reward.organizationId,
        id: reward.id,
        isActive: reward.isActive ? 1 : 0,
        name: reward.name,
        description: reward.description,
        requiredPoints: parseFloat(reward.requiredPoints) * 100,
        total: parseInt(reward.total),
        updatedAt: now,
      };

      await request(updateOrganizationReward, { input: data });
    }

    resetState();
    onClose && onClose();
  };

  const resetState = () => {
    setIsLoading(false);
    setVisible(false);
    setReward({});
    setIsDirty(false);
    setErrors([]);
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
        label: '名稱',
        autoCorrect: false,
        disabled: !isActiveReward,
      },
    },
    {
      key: 'description',
      required: false,
      props: {
        label: '內容',
        autoCorrect: false,
        disabled: !isActiveReward,
      },
    },
    {
      key: 'requiredPoints',
      type: 'number',
      required: true,
      props: {
        label: '所需點數',
        keyboardType: 'number-pad',
        disabled: !isActiveReward,
      },
    },
    {
      key: 'total',
      type: 'number',
      required: true,
      props: {
        label: '數量',
        keyboardType: 'number-pad',
        disabled: !isActiveReward,
      },
    },
  ];

  useEffect(() => {
    if (inItem) {
      setReward(Object.assign({}, inItem, {
        requiredPoints: `${inItem.requiredPoints / 100}`,
        total: `${inItem.total}`,
        isActive: inItem.isActive === 1,
      }));
      setVisible(true);
    } else {
      (async () => {
        const organizationId = await AsyncStorage.getItem('app:organizationId');
        setReward({
          organizationId,
          id: uuidv1(),
        });
      })();
    }
  }, [inItem]);

  return (
    <React.Fragment>
      {!hideButton &&
        <AddButton
          onPress={async () => {
            if (!await check('ORG_TSK__CREATE', true)) return;
            setVisible(true);
          }}
        />}
      <CustomModal
        title={`${isEditMode ? '修改':'新增'}獎品`}
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
          defaultValue={reward}
          onUpdate={(data)=>{
            console.log({ ...reward, ...data });
            setReward({ ...reward, ...data });
            setIsDirty(true);
          }}
          onSubmit={() => handleSubmit()}
        />
        <RewardAvatar
          organizationId={reward.organizationId}
          id={reward.id}
          editable={true}
          size="large"
          onUpdate={() => setIsDirty(true)}
        />
      </CustomModal>
    </React.Fragment>

  );
}
