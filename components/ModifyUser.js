import React, { useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import moment from 'moment';

import AddButton from './AddButton';
import CustomModal from './CustomModal';
import Form from './Form';
import request, { asyncListAll } from '../src/utils/request';
import Colors from '../constants/Colors';
import { listOrganizationGroups } from '../src/graphql/queries';
import { createOrganizationUser, updateOrganizationUser } from '../src/graphql/mutations';
import check from '../src/permission/check';

// TODO: Use api or constants
// TODO: Cognito User Group
const roles = [
  // { name: '管理員', id: 'Admin' },
  { name: '老師', id: 'Manager' },
  { name: '學生', id: 'User' },
  { name: '審核中', id: 'PendingApproval' },
];

export default function ModifyUser({ user: inUser, button }) {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [groups, setGroups] = useState([]);
  const [user, setUser] = useState({ role: 'User' });
  const [errors, setErrors] = useState([]);

  const isModified = inUser ? true : false;

  const handleSubmit = async () => {
    if (isModified && !await check('ORG_USER__UPDATE', true)) return;
    if (!isModified && !await check('ORG_USER__CREATE', true)) return;

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

    if (!isModified) {
      const data = Object.assign(user, {
        organizationId,
        isActive: 1,
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
      });

      await request(updateOrganizationUser, { input: data });
    }

    setIsLoading(false);
    setVisible(false);
    setUser({});
  };

  const fields = [
    {
      key: 'role',
      required: true,
      type: 'select',
      options: roles.map((item) => {
        return { label: item.name, value: item.id };
      }),
      props: {
        label: '身份',
      },
    },
    {
      key: 'groupId',
      required: false,
      type: 'select',
      options: groups.map((item) => {
        return { label: item.name, value: item.id };
      }),
      props: {
        label: '分組',
      },
    },
    {
      key: 'name',
      required: true,
      props: {
        label: '姓名',
        autoCorrect: false,
      },
    },
    {
      key: 'idNumber',
      required: true,
      props: {
        label: '學號',
        autoCorrect: false,
        autoCapitalize: 'none',
      },
    },
    {
      key: 'username',
      required: true,
      props: {
        label: '帳號',
        autoCorrect: false,
        autoCapitalize: 'none',
        disabled: isModified ? true : false,
      },
    },
  ];

  useEffect(() => {
    if (inUser) {
      setUser(inUser);
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
              color={Colors.dark }
              containerStyle={{ paddingRight: 10 }}
            />
          }
          type="clear"
          title={'修改資料'}
          titleStyle={{ color: Colors.dark }}
          onPress={()=>setVisible(true)}
        />:
        <AddButton
          onPress={() => setVisible(true)}
        />}
      <CustomModal
        title={`${isModified ? '修改':'新增'}個人資料`}
        visible={visible}
        onClose={() => setVisible(false)}
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
