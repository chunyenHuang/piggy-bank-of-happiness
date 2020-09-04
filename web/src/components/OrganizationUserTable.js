import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Table from 'components/Table/Table';
// import LinkButton from 'components/Table/LinkButton';
import { listOrganizationUsers, getOrgUsersByGroupByActive, getOrgUsersByRoleByOrg } from 'graphql/queries';
import { updateOrganizationUser } from 'graphql/mutations';
import { asyncListAll, request } from 'utilities/graph';
import { sortBy } from 'utilities/sorting';
import roles from 'constants/roles';

const columns = [
  {
    name: 'role',
    label: '職位',
    options: {
      filter: true,
      sort: true,
      customBodyRender(item) {
        const matched = roles.find(({ value }) => value === item);
        return matched ? matched.label : item;
      },
    },
  },
  {
    name: 'isActive',
    label: '使用中',
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
    name: 'username',
    label: '帳號',
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'idNumber',
    label: 'ID',
    edit: {
      type: 'text',
    },
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'name',
    label: '名字',
    edit: {
      type: 'text',
    },
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'currentPoints',
    label: '目前點數',
    type: 'number',
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'earnedPoints',
    label: '總點數',
    type: 'number',
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'createdAt',
    label: '創立於',
    type: 'datetime',
    options: {
      display: false,
      filter: false,
      sort: true,
    },
  },
  {
    name: 'updatedAt',
    label: '更新於',
    type: 'datetime',
    options: {
      display: false,
      filter: false,
      sort: true,
    },
  },
  // {
  //   name: 'id',
  //   label: ' ',
  //   options: {
  //     display: true,
  //     filter: false,
  //     sort: false,
  //     customBodyRender(username) {
  //       return (
  //         <LinkButton
  //           path={`/organizationUser/${username}`}
  //           label="前往使用者專頁"
  //         />
  //       );
  //     },
  //   },
  // },
];

function OrganizationUserTable({
  title = '人員列表',
  description,
  organizationId,
  groupId,
  roles,
  nested,
}) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState();

  const options = {};

  const onUpate = async (item, dataIndex) => {
    const input = {
      organizationId: item.organizationId,
      username: item.username,
    };
    columns.forEach(({ name, edit }) => {
      if (edit) {
        input[name] = item[name];
      }
    });
    await request(updateOrganizationUser, { input });

    Object.assign(data[dataIndex], input);
    setData([...data]);
  };


  useEffect(() => {
    if (!organizationId && !groupId) return;

    (async () => {
      try {
        setIsLoading(true);

        let records = [];
        if (groupId) {
          records = (await asyncListAll(getOrgUsersByGroupByActive, { groupId }));
        } else
        if (organizationId) {
          if (roles && roles.length > 0) {
            const promises = roles.map(async (role) => {
              const results = await asyncListAll(getOrgUsersByRoleByOrg, {
                role,
                organizationId: { eq: organizationId },
              });
              records = [...records, ...results];
            });
            await Promise.all(promises);
          } else {
            records = (await asyncListAll(listOrganizationUsers, { organizationId }));
          }
        }

        setData(records.sort(sortBy('name')).sort(sortBy('role')).sort(sortBy('isActive', true)));
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [organizationId, groupId, roles, lastUpdatedAt]);

  return (
    <Table
      title={title}
      isLoading={isLoading}
      description={description}
      nested={nested}
      data={data}
      columns={columns}
      options={options}
      onUpdateItem={onUpate}
      onRefresh={() => setLastUpdatedAt(Date.now())}
    />
  );
}

OrganizationUserTable.propTypes = {
  organizationId: PropTypes.string,
  groupId: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  nested: PropTypes.bool,
  roles: PropTypes.array,
};

export default OrganizationUserTable;
