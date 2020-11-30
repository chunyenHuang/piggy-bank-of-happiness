import React, { useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import { Hub } from 'aws-amplify';

import AddButton from './AddButton';
import CustomModal from './CustomModal';
import Form from './Form';
import request, { asyncListAll } from 'src/utils/request';
import { listOrganizationGroups, getOrganizationUser } from 'src/graphql/queries';
import { userOperation } from 'src/graphql/mutations';
import check from 'src/permission/check';
import { sortBy } from 'src/utils/sorting';

// const roles = [
//   { name: '學生', id: 'User' },
//   { name: '審核中', id: 'PendingApproval' },
// ];

export default function ModifyUser({ user: inUser, button, visible: inVisible, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, setVisible] = useState(!!inVisible);
  const [isDirty, setIsDirty] = useState(false);
  const [groups, setGroups] = useState([]);
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

    try {
      setIsLoading(true);
      const organizationId = await AsyncStorage.getItem('app:organizationId');

      // const now = moment().toISOString();

      if (!isEditMode) {
        const data = {
          organizationId,
          username: user.username,
          role: 'User',
          idNumber: user.idNumber,
          name: user.name,
          email: user.email,
          groupId: user.groupId,
          password: user.password,
        };

        await request(userOperation, { input: { users: [data] } });
      } else {
        const data = {
          organizationId,
          username: user.username,
          role: user.role,
          idNumber: user.idNumber,
          name: user.name,
          email: user.email,
          groupId: user.groupId,
          isActive: user.isActive ? 1 : 0,
        };

        // await request(updateOrganizationUser, { input: data });
        await request(userOperation, { input: { users: [data] } });
      }
    } catch (err) {
      global.logger.error(err);
    } finally {
      setIsLoading(false);
    }

    resetState();
  };

  const resetState = () => {
    setIsLoading(false);
    setVisible(false);
    setIsDirty(false);
    if (!inUser) {
      setUser({});
    }
    setErrors([]);

    Hub.dispatch('user', { event: 'reload' });

    if (onClose) onClose();
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
    // {
    //   key: 'role',
    //   required: true,
    //   type: 'select',
    //   options: roles.map((item) => {
    //     return { label: item.name, value: item.id };
    //   }),
    //   props: {
    //     label: '身份',
    //     disabled: !isActiveUser,
    //     hidden: false,
    //   },
    // },
    {
      key: 'groupId',
      required: true,
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
      key: 'email',
      required: true,
      props: {
        label: 'Email',
        autoCorrect: false,
        autoCapitalize: 'none',
      },
    },
    {
      key: 'username',
      required: true,
      props: {
        label: '登入帳號',
        autoCorrect: false,
        autoCapitalize: 'none',
        disabled: isEditMode ? true : false,
      },
    },
    {
      key: 'password',
      required: !isEditMode,
      props: {
        label: '密碼',
        autoCorrect: false,
        autoCapitalize: 'none',
        disabled: isEditMode ? true : false,
      },
    },
  ];

  useEffect(() => {
    (async () => {
      if (inUser) {
        const { organizationId, username } = inUser;
        const { data: { getOrganizationUser: user } } = await request(getOrganizationUser, { organizationId, username });
        setUser(Object.assign({}, user, {
          isActive: inUser.isActive === 1,
        }));
      }
    })();
  }, [inUser]);

  useEffect(() => {
    setVisible(inVisible);
  }, [inVisible]);

  useEffect(() => {
    (async () => {
      const organizationId = await AsyncStorage.getItem('app:organizationId');
      const groups = await asyncListAll(listOrganizationGroups, { organizationId });
      setGroups(groups);
    })();
  }, []);

  return (
    <React.Fragment>
      { button &&
        <AddButton
          onPress={() => setVisible(true)}
        />}
      <CustomModal
        title={`${isEditMode ? '修改':'新增'}個人資料`}
        visible={visible}
        onClose={resetState}
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
