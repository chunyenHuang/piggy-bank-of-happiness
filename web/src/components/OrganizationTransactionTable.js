import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Table from 'components/Table/Table';
import NestedTableContainer from 'components/Table/NestedTableContainer';
import OrganizationTaskTable from 'components/OrganizationTaskTable';

import { listOrganizationTransactions } from 'graphql/queries';
import { updateOrganizationTransaction } from 'graphql/mutations';
import { asyncListAll, request } from 'utilities/graph';
import { sortBy } from 'utilities/sorting';

const columns = [
  {
    name: 'isCancelled',
    label: '已取消',
    type: 'checkbox',
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
    name: 'user.name',
    label: '使用者',
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'type',
    label: '類別',
    options: {
      filter: true,
      sort: true,
    },
  },
  {
    name: 'points',
    label: '點數',
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'note',
    label: '備註',
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

export default function OrganizationTransactionTable({ title = '交易紀錄', description, organizationId }) {
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
    await request(updateOrganizationTransaction, { input });

    Object.assign(data[dataIndex], input);
    setData([...data]);
  };


  useEffect(() => {
    if (!organizationId) return;

    (async () => {
      try {
        const records = (await asyncListAll(listOrganizationTransactions, { organizationId }));
        setData(records.sort(sortBy('createdAt', true)));
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

OrganizationTransactionTable.propTypes = {
  organizationId: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
};
