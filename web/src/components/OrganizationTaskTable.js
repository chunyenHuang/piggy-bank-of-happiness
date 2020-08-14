import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Table from 'components/Table/Table';
import { listOrganizationTasks, getOrgTasksByProgramByActive } from 'graphql/queries';
import { updateOrganizationTask } from 'graphql/mutations';
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
    name: 'id',
    label: 'ID',
    options: {
      display: false,
      filter: false,
      sort: false,
    },
  },
  {
    name: 'program.name',
    label: '類別',
    options: {
      display: false,
      filter: true,
      sort: true,
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
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: 'note',
    label: '註記',
    options: {
      display: false,
      filter: false,
      sort: false,
    },
  },
  {
    name: 'point',
    label: '點數',
    type: 'number',
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'pointMin',
    label: '最低點數',
    type: 'number',
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'pointMax',
    label: '最高點數',
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
      filter: false,
      sort: true,
    },
  },
];

function OrganizationTaskTable({ title = '任務列表', description, organizationId, programId }) {
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
    await request(updateOrganizationTask, { input });

    Object.assign(data[dataIndex], input);
    setData([...data]);
  };


  useEffect(() => {
    (async () => {
      try {
        let records;
        if (organizationId) {
          records = (await asyncListAll(listOrganizationTasks, { organizationId }));
        } else
        if (programId) {
          records = (await asyncListAll(getOrgTasksByProgramByActive, { programId }));
        }

        if (records) {
          setData(records.sort(sortBy('name')).sort(sortBy('isActive', true)));
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, [organizationId, programId]);

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

OrganizationTaskTable.propTypes = {
  organizationId: PropTypes.string,
  programId: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default OrganizationTaskTable;
