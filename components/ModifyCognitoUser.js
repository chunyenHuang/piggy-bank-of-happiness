import React, { useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import moment from 'moment';

import AddButton from './AddButton';
import CustomModal from './CustomModal';
import Form from './Form';
import request from '../src/utils/request';
import Colors from '../constants/Colors';

import { listOrganizations, getOrganizationUser } from '../src/graphql/queries';
import { createOrganizationUser, updateOrganizationUser, deleteOrganizationUser } from '../src/graphql/mutations';
import { updateUserAttributes, addUserToGroup, getUserGroup, getRoleByGroup } from '../src/admin/services';

export default function ModifyCognitoUser({ user: inUser, button }) {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [user, setUser] = useState({});
  const [orgUser, setOrgUser] = useState(undefined);
  const [errors, setErrors] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  const isModified = inUser ? true : false;

  const handleSubmit = async () => {
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

    const organizationId = user['custom:organizationId'];
    const { username, userGroup, name } = user;
    const now = moment().toISOString();

    // Update Cognito User
    await updateUserAttributes(username, {
      'custom:organizationId': organizationId,
      'custom:organizationName': organizations.find((x) => x.id === organizationId).name,
    });

    // TODO: remove user from group
    await addUserToGroup(username, userGroup);

    // Update DDB User
    const role = getRoleByGroup(userGroup);
    let shouldCreateOrgUser = true;

    if (orgUser) {
      if (orgUser.organizationId === organizationId) {
        // update role
        const data = {
          organizationId,
          username,
          role,
          updatedAt: now,
        };

        await request(updateOrganizationUser, { input: data });
        shouldCreateOrgUser = false;
      } else {
        // remove from current org and create a new one
        const data = {
          organizationId: orgUser.organizationId,
          username,
        };
        await request(deleteOrganizationUser, { input: data });
      }
    }

    if (shouldCreateOrgUser) {
      const data = {
        organizationId,
        username,
        idNumber: 'N/A',
        name,
        role,
        isActive: 1,
        currentPoints: 0,
        earnedPoints: 0,
        createdAt: now,
        updatedAt: now,
      };

      await request(createOrganizationUser, { input: data });
    }

    setIsLoading(false);
    setVisible(false);
    setUser({});
    setOrgUser(undefined);
  };

  const fields = [
    {
      key: 'custom:organizationId',
      required: true,
      type: 'select',
      options: organizations.map((item) => {
        return { label: item.name, value: item.id };
      }),
      props: {
        label: '機構',
      },
    },
    {
      key: 'userGroup',
      required: true,
      type: 'select',
      options: [
        { value: 'AppAdmins' },
        { value: 'OrgAdmins' },
        { value: 'OrgManagers' },
      ],
      props: {
        label: '權限',
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
    {
      key: 'name',
      required: true,
      props: {
        label: '姓名',
        autoCorrect: false,
        disabled: true,
      },
    },
    {
      key: 'email',
      required: true,
      props: {
        label: 'Email',
        autoCorrect: false,
        disabled: true,
      },
    },
    {
      key: 'status',
      required: true,
      props: {
        label: '註冊狀態',
        autoCorrect: false,
        disabled: true,
      },
    },
    {
      key: 'createdAt',
      required: true,
      props: {
        label: '註冊時間',
        disabled: true,
      },
    },
    {
      key: 'updatedAt',
      required: true,
      props: {
        label: '更新時間',
        disabled: true,
      },
    },
  ];

  useEffect(() => {
    (async () => {
      const { data: { listOrganizations: { items: organizations } } } = await request(listOrganizations, {
        limit: 100,
      });
      setOrganizations(organizations);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (inUser) {
        console.log(inUser);

        inUser.userGroup = await getUserGroup(inUser.username);

        if (inUser['custom:organizationId']) {
          const { data: { getOrganizationUser: orgUser } } = await request(getOrganizationUser, {
            organizationId: inUser['custom:organizationId'],
            username: inUser.username,
          });
          setOrgUser(orgUser);
        }

        setUser(inUser);
        setVisible(true);
      }
    })();
  }, [inUser]);

  return (
    <React.Fragment>
      {button ?
        <AddButton
          onPress={() => setVisible(true)}
        /> : null}
      <CustomModal
        title={`${isModified ? '修改':'新增'}用戶資料`}
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
