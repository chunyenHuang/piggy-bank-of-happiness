import React, { useEffect, useState } from 'react';

import Table from 'components/Table/Table';
// import LinkButton from 'components/Table/LinkButton';
import { listOrganizations } from 'graphql/queries';
import { updateOrganization } from 'graphql/mutations';
import { asyncListAll, request } from 'utilities/graph';

const title = '機構列表';
const description = '';

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
    name: 'id',
    label: 'ID',
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: 'name',
    label: '名稱',
    edit: {
      type: 'text',
    },
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'description',
    label: '描述',
    edit: {
      type: 'text',
    },
    options: {
      filter: false,
      sort: false,
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
  // TODO: Switch organization
  // {
  //   name: 'id',
  //   label: ' ',
  //   options: {
  //     display: true,
  //     filter: false,
  //     sort: false,
  //     customBodyRender(id) {
  //       return (
  //         <LinkButton
  //           path={`/organization/${id}`}
  //           label="前往機構專頁"
  //         />
  //       );
  //     },
  //   },
  // },
];

function OrganizationTable() {
  const [data, setData] = useState([]);
  const options = {};

  const onUpate = async (item, dataIndex) => {
    const input = {
      id: item.id,
    };
    columns.forEach(({ name, edit }) => {
      if (edit) {
        input[name] = item[name];
      }
    });
    await request(updateOrganization, { input }, {});

    Object.assign(data[dataIndex], input);
    setData([...data]);
  };


  useEffect(() => {
    (async () => {
      try {
        const records = (await asyncListAll(listOrganizations));
        setData(records);
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

export default OrganizationTable;
