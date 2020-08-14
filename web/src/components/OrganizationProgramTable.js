import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Table from 'components/Table/Table';
import NestedTableContainer from 'components/Table/NestedTableContainer';
import OrganizationTaskTable from 'components/OrganizationTaskTable';

import { listOrganizationPrograms } from 'graphql/queries';
import { updateOrganizationProgram } from 'graphql/mutations';
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
    name: 'name',
    label: '任務類別名稱',
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
    name: 'createdBy',
    label: '創立者',
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

export default function OrganizationProgramTable({ title = '任務', description, organizationId }) {
  const [data, setData] = useState([]);

  const options = {
    expandableRows: true,
    isRowExpandable: () => true,
    renderExpandableRow(rowData, rowMeta) {
      const { id } = data[rowMeta.dataIndex];
      console.log(id);
      return (
        <NestedTableContainer columns={columns}>
          <OrganizationTaskTable programId={id} />
        </NestedTableContainer>
      );
    },
  };

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
    await request(updateOrganizationProgram, { input });

    Object.assign(data[dataIndex], input);
    setData([...data]);
  };


  useEffect(() => {
    if (!organizationId) return;

    (async () => {
      try {
        const records = (await asyncListAll(listOrganizationPrograms, { organizationId }));
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

OrganizationProgramTable.propTypes = {
  organizationId: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
};
