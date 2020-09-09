import React, { useEffect, useState } from 'react';

import Table from 'components/Table/Table';

import {
  listUsersInGroup,
  removeUserFromGroup,
  addUserToGroup,
  disableUser,
  enableUser,
} from 'utilities/cognito';
import { sortBy } from 'utilities/sorting';
import cognitoGroups from 'constants/cognitoGroups';

const title = '軟體用戶列表';
const description = '';

const columns = [
  {
    name: 'custom:organizationName',
    label: '機構',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'role',
    label: '權限',
    edit: {
      type: 'select',
      menu: cognitoGroups,
    },
    options: {
      filter: true,
      sort: true,
      customBodyRender(item) {
        const matched = cognitoGroups.find(({ value }) => value === item);
        return matched ? matched.label : item;
      },
    },
  },
  {
    name: 'username',
    label: 'ID',
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: 'name',
    label: '名字',
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'email',
    label: 'Email',
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'status',
    label: '狀態',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'email_verified',
    label: 'Email認證',
    type: 'checkbox',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'enabled',
    label: '登入權限',
    type: 'checkbox',
    edit: {
      type: 'checkbox',
    },
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'createdAt',
    label: '創立於',
    type: 'datetime',
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'updatedAt',
    label: '更新於',
    type: 'datetime',
    options: {
      filter: false,
      sort: true,
    },
  },
];

export default function CognitoUsersTable() {
  const [data, setData] = useState([]);
  const options = {};

  const onUpate = async (item, dataIndex) => {
    const input = {};
    columns.forEach(({ name, edit }) => {
      if (edit) {
        input[name] = item[name];
      }
    });

    const { username, role, enabled } = data[dataIndex];

    if (role !== input.role) {
      await removeUserFromGroup(username, role);
      await addUserToGroup(username, input.role);
    }

    if (enabled !== input.enabled) {
      if (input.enabled === true) {
        await enableUser(username);
      } else {
        await disableUser(username);
      }
    }

    Object.assign(data[dataIndex], {
      enabled: input.enabled,
      role: input.role,
    });

    setData([...data]);
  };

  useEffect(() => {
    (async () => {
      try {
        const groups = cognitoGroups.map(({ value }) => value);
        const results = await Promise.all(groups.map((group) => listUsersInGroup(group, true)));

        const allUsers = [];
        results.forEach(({ data: groupUsers }, index) => {
          groupUsers.forEach((user) => {
            user.role = groups[index];
            allUsers.push(user);
          });
        });

        setData(allUsers
          .sort(sortBy('name'))
          .sort(sortBy('username'))
          .sort(sortBy('role'))
          .sort(sortBy('custom:organizationName')),
        );
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <Table
      title={title}
      description={description}
      data={data}
      columns={columns}
      options={options}
      onUpdateItem={onUpate}
    />
  );
}
