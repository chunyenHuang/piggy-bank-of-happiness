import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import DataTable from 'components/Table/DataTable';
// import Table from 'components/Table/Table';
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

export default function OrganizationTransactionTable({
  title = '交易紀錄',
  description,
  organizationId,
  id,
  nested,
  data: inData,
  onRefresh,
}) {
  const [indexes, setIndexes] = useState();
  const [queryParams, setQueryParams] = useState();

  const options = {
    expandableRows: true,
    isRowExpandable: () => false,
  };

  // const onUpate = async (item, dataIndex) => {
  //   const input = {
  //     organizationId: item.organizationId,
  //     username: item.username,
  //     updatedBy: localStorage.getItem('app:username'),
  //   };
  //   columns.forEach(({ name, edit }) => {
  //     if (edit) {
  //       input[name] = item[name];
  //     }
  //   });
  //   await request(updateOrganizationTransaction, { input });

  //   Object.assign(data[dataIndex], input);
  //   setData([...data]);
  // };


  // useEffect(() => {
  //   if (!organizationId) return;

  //   (async () => {
  //     try {
  //       setIsLoading(true);
  //       const params = { organizationId };
  //       if (id) {
  //         params.id = { eq: id };
  //       }
  //       const records = (await asyncListAll(listOrganizationTransactions, params));
  //       setData(records.sort(sortBy('createdAt', true)));
  //     } catch (e) {
  //       console.log(e);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   })();
  // }, [organizationId, id, lastUpdatedAt]);

  // useEffect(() => {
  //   if (!inData) return;

  //   setData(inData);
  // }, [inData]);

  useEffect(() => {
    if (!organizationId) return;

    setIndexes([
      {
        name: 'listOrganizationTransactions',
        label: '交易紀錄查詢',
        partitionKey: 'organizationId',
        sortKey: 'expiredAt',
        fields: [{
          label: '機構ID',
          key: 'organizationId',
          // type: 'select',
          // options: [
          //   { value: organizationId, label: '機構ID' },
          // ],
        }, {
          label: '交易紀錄編號',
          key: 'id',
          // type: 'select',
          // options: id ? [
          //   { value: id, label: 'ID' },
          // ] : [],
        }],
        operation: listOrganizationTransactions,
      },
    ]);
    setQueryParams({
      organizationId: 'organizationId',
      id,
    });
  }, [organizationId, id]);

  return (
    <DataTable
      data={inData}
      title={title}
      description={description}
      columns={columns}
      options={options}
      indexes={indexes}
      queryDefaultParams={queryParams}
      // editButton={EditButton}
      dataSortFunc={sortBy('createdAt', true)}
    />
    // <Table
    //   title={title}
    //   description={description}
    //   isLoading={isLoading}
    //   data={data}
    //   nested={nested}
    //   columns={columns}
    //   options={options}
    //   onUpdateItem={onUpate}
    //   onRefresh={() => {
    //     if (onRefresh) onRefresh();
    //     setLastUpdatedAt(Date.now());
    //   }}
    // />
  );
}

OrganizationTransactionTable.propTypes = {
  organizationId: PropTypes.string.isRequired,
  id: PropTypes.string,
  nested: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  onRefresh: PropTypes.func,
  data: PropTypes.array,
};
