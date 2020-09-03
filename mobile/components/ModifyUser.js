import React, { useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import moment from 'moment';

import AddButton from './AddButton';
import CustomModal from './CustomModal';
import Form from './Form';
import request, { asyncListAll } from 'src/utils/request';
import Colors from 'constants/Colors';
import { listOrganizationGroups } from 'src/graphql/queries';
import { createOrganizationUser, updateOrganizationUser } from 'src/graphql/mutations';
import check from 'src/permission/check';
import { sortBy } from 'src/utils/sorting';

// TODO: Use api or constants
// TODO: Cognito User Group
const roles = [
  { name: '學生', id: 'User' },
  { name: '審核中', id: 'PendingApproval' },
];

export default function ModifyUser({ user: inUser, button, isApproval = false }) {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [groups, setGroups] = useState([]);
  const [originalUser, setOriginalUser] = useState({});
  const [user, setUser] = useState({});
  const [errors, setErrors] = useState([]);

  const isEditMode = inUser ? true : false;
  const isActiveUser = isEditMode ? user.isActive : true;

  const handleSubmit = async () => {
    if (isEditMode && !await check('ORG_USER__UPDATE', true)) return;
    if (!isEditMode && !await check('ORG_USER__CREATE', true)) return;

    const errors = fields.map(({ key, required }) => {
      if (required && !user[key]) {
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

    const now = moment().toISOString();

    if (!isEditMode) {
      const data = Object.assign(user, {
        organizationId,
        isActive: 1,
        role: 'User',
        currentPoints: 0,
        earnedPoints: 0,
        createdAt: now,
        updatedAt: now,
      });

      await request(createOrganizationUser, { input: data });
    } else {
      const data = Object.assign({
        organizationId,
        username: user.username,
        role: user.role,
        groupId: user.groupId,
        name: user.name,
        idNumber: user.idNumber,
        updatedAt: now,
        isActive: user.isActive ? 1 : 0,
      });

      await request(updateOrganizationUser, { input: data });
    }

    resetState();
  };

  const resetState = () => {
    setIsLoading(false);
    setVisible(false);
    setOriginalUser({});
    setUser({});
    setIsDirty(false);
    setErrors([]);
  };

  const fields = [
    {
      key: 'isActive',
      props: {
        enabledLabel: '帳號使用中',
        disabledLabel: '帳號停用中',
        hidden: !isEditMode,
      },
      type: 'switch',
    },
    {
      key: 'role',
      required: true,
      type: 'select',
      options: roles.map((item) => {
        return { label: item.name, value: item.id };
      }),
      props: {
        label: '身份',
        disabled: !isActiveUser,
        hidden: !isApproval,
      },
    },
    {
      key: 'groupId',
      required: !isApproval,
      type: 'select',
      options: groups.sort(sortBy('name')).sort(sortBy('isActive', true)).map((item) => {
        const appendix = item.isActive === 0 ? '(停用中)' : '';
        return { label: item.name + appendix, value: item.id, disabled: item.isActive === 0 };
      }),
      props: {
        label: '分組',
        disabled: !isActiveUser,
        placeholder: '選擇組別',
      },
    },
    {
      key: 'name',
      required: true,
      props: {
        label: '姓名',
        autoCorrect: false,
        disabled: !isActiveUser,
      },
    },
    {
      key: 'idNumber',
      required: true,
      props: {
        label: '學號',
        autoCorrect: false,
        autoCapitalize: 'none',
        disabled: !isActiveUser,
      },
    },
    {
      key: 'username',
      required: true,
      props: {
        label: '帳號',
        autoCorrect: false,
        autoCapitalize: 'none',
        disabled: isEditMode ? true : false,
      },
    },
  ];

  useEffect(() => {
    if (inUser) {
      setOriginalUser(Object.assign({}, inUser, {
        isActive: inUser.isActive === 1,
      }));
      setUser(Object.assign({}, inUser, {
        isActive: inUser.isActive === 1,
      }));
    }
  }, [inUser]);

  useEffect(() => {
    (async () => {
      const organizationId = await AsyncStorage.getItem('app:organizationId');
      const groups = await asyncListAll(listOrganizationGroups, { organizationId });
      setGroups(groups);
    })();
  }, []);

  return (
    <React.Fragment>
      {button ?
        <Button
          icon={
            <Icon
              name={'md-create'}
              type='ionicon'
              color={'#fff'}
            />
          }
          type="clear"

          onPress={()=>setVisible(true)}
        />:
        <AddButton
          onPress={() => setVisible(true)}
        />}
      <CustomModal
        title={`${isEditMode ? '修改':'新增'}個人資料`}
        visible={visible}
        onClose={() => {
          // restore user data
          setVisible(false);
          const cloneOrignalUser = JSON.parse(JSON.stringify(originalUser));
          setUser(cloneOrignalUser);
          setIsDirty(false);
          setErrors([]);
        }}
        padding
        bottomButtonProps={{
          title: `確認`,
          onPress: ()=> handleSubmit(),
          disabled: !isDirty || isLoading,
        }}
      >
        <Form
          fields={fields}
          errors={errors}
          defaultValue={user}
          onUpdate={(data)=>{
            setUser(data);
            setIsDirty(true);
          }}
          onSubmit={()=>handleSubmit()}
        />
      </CustomModal>
    </React.Fragment>

  );
}
