import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Table from 'components/Table/Table';
// import NestedTableContainer from 'components/Table/NestedTableContainer';

import { listOrganizationTransactions } from 'graphql/queries';
import { updateOrganizationTransaction } from 'graphql/mutations';
import { asyncListAll, request } from 'utilities/graph';
import { sortBy } from 'utilities/sorting';
import transactionTypes from 'constants/transactionTypes';

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
    name: 'type',
    label: '類別',
    options: {
      filter: true,
      sort: true,
      customBodyRender(item) {
        const matched = transactionTypes.find(({ value }) => value === item);
        return matched ? matched.label : item;
      },
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
    name: 'points',
    label: '點數',
    type: 'point',
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
    label: '經手人',
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'updatedBy',
    label: '更新者',
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
];

export default function OrganizationTransactionTable({ title = '交易紀錄', description, organizationId }) {
  const [lastUpdatedAt, setLastUpdatedAt] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const options = {
    expandableRows: true,
    isRowExpandable: () => false,
    // renderExpandableRow(rowData, rowMeta) {
    //   const { id } = data[rowMeta.dataIndex];
    //   console.log(id);
    //   return (
    //     <NestedTableContainer columns={columns}>
    //     </NestedTableContainer>
    //   );
    // },
  };

  const onUpate = async (item, dataIndex) => {
    const input = {
      organizationId: item.organizationId,
      username: item.username,
      updatedBy: localStorage.getItem('app:username'),
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
        setIsLoading(true);
        const records = (await asyncListAll(listOrganizationTransactions, { organizationId }));
        setData(records.sort(sortBy('createdAt', true)));
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [organizationId, lastUpdatedAt]);

  return (
    <Table
      title={title}
      description={description}
      isLoading={isLoading}
      data={data}
      columns={columns}
      options={options}
      onUpdateItem={onUpate}
      onRefresh={() => setLastUpdatedAt(Date.now())}
    />
  );
}

OrganizationTransactionTable.propTypes = {
  organizationId: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
};
