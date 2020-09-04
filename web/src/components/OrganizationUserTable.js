import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Table from 'components/Table/Table';
import LinkButton from 'components/Table/LinkButton';
import { listOrganizationUsers } from 'graphql/queries';
import { updateOrganizationUser } from 'graphql/mutations';
import { asyncListAll, request } from 'utilities/graph';
import { sortBy } from 'utilities/sorting';

const columns = [
  {
    name: 'isActive',
    label: '狀態',
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
    name: 'role',
    label: '職位',
    options: {
      filter: true,
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

function OrganizationUserTable({ title = '人員列表', description, organizationId }) {
  const [data, setData] = useState([]);
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
    if (!organizationId) return;

    (async () => {
      try {
        const records = (await asyncListAll(listOrganizationUsers, { organizationId }));
        setData(records.sort(sortBy('name')).sort(sortBy('isActive', true)));
      } catch (e) {
        console.log(e);
      }
    })();
  }, [organizationId]);

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

OrganizationUserTable.propTypes = {
  organizationId: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default OrganizationUserTable;
