import React, { useEffect, useState } from 'react';

import Table from 'components/Table/Table';

import {
  listUsersInGroup,
  // removeUserFromGroup,
  // addUserToGroup,
  disableUser,
  enableUser,
  getRoleByGroup,
} from 'utilities/cognito';
import { sortBy } from 'utilities/sorting';
import cognitoGroups from 'constants/cognitoGroups';
import { listOrganizations } from 'graphql/queries';
import { userOperation } from 'graphql/mutations';
import { asyncListAll, request } from 'utilities/graph';

const title = '軟體用戶列表';
const description = '';

export default function CognitoUsersTable() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState();
  const [orgMenu, setOrgMenu] = useState([]);
  const options = {};

  const columns = [
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
      name: 'custom:organizationId',
      label: '機構',
      edit: {
        type: 'select',
        menu: orgMenu,
      },
      options: {
        filter: true,
        sort: true,
        customBodyRender(item) {
          const matched = orgMenu.find(({ value }) => value === item);
          return matched ? matched.label : item;
        },
      },
    },
    {
      name: 'cognitoGroup',
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

  const onUpate = async (item, dataIndex) => {
    const input = {};
    columns.forEach(({ name, edit }) => {
      if (edit) {
        input[name] = item[name];
      }
    });

    const {
      cognitoGroup: newCognitoGroup,
      enabled: newEnabled,
    } = input;
    const newOrgId = input['custom:organizationId'];
    const {
      username,
      cognitoGroup,
      enabled,
      name,
      email,
    } = data[dataIndex];
    const organizationId = data[dataIndex]['custom:organizationId'];

    if (cognitoGroup !== newCognitoGroup || organizationId !== newOrgId) {
      // await removeUserFromGroup(username, role);
      // await addUserToGroup(username, input.role);
      const user = {
        username,
        organizationId: newOrgId,
        name,
        email,
        role: getRoleByGroup(newCognitoGroup),
        idNumber: 'N/A',
      };

      await request(userOperation, {
        input: {
          force: true,
          users: [user],
        },
      });
    }

    if (enabled !== newEnabled) {
      if (newEnabled === true) {
        await enableUser(username);
      } else {
        await disableUser(username);
      }
    }

    setLastUpdatedAt(Date.now());
  };

  useEffect(() => {
    (async () => {
      const organizations = await asyncListAll(listOrganizations);
      setOrgMenu(organizations.map(({ name, id }) => {
        return { label: name, value: id };
      }).sort(sortBy('label')));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const groups = cognitoGroups.map(({ value }) => value);
        const results = await Promise.all(groups.map((group) => listUsersInGroup(group, true)));

        const allUsers = [];
        results.forEach(({ data: groupUsers }, index) => {
          groupUsers.forEach((user) => {
            user.cognitoGroup = groups[index];
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
      } finally {
        setIsLoading(false);
      }
    })();
  }, [lastUpdatedAt]);

  return (
    <Table
      title={title}
      description={description}
      data={data}
      columns={columns}
      options={options}
      onUpdateItem={onUpate}
      isLoading={isLoading}
      onRefresh={() => setLastUpdatedAt(Date.now())}
    />
  );
}
