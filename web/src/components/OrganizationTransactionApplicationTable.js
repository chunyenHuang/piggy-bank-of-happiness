import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Table from 'components/Table/Table';
// import NestedTableContainer from 'components/Table/NestedTableContainer';

import { listOrganizationTransactionApplications } from 'graphql/queries';
import { updateOrganizationTransactionApplication } from 'graphql/mutations';
import { asyncListAll, request } from 'utilities/graph';
import { sortBy } from 'utilities/sorting';
import transactionTypes from 'constants/transactionTypes';
import transactionApplicationStatus from 'constants/transactionApplicationStatus';

const columns = [
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
    name: 'status',
    label: '狀態',
    options: {
      filter: true,
      sort: true,
      customBodyRender(item) {
        const matched = transactionApplicationStatus.find(({ value }) => value === item);
        return matched ? matched.label : item;
      },
    },
  },
  {
    name: 'user.name',
    label: '申請人',
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
    name: 'description',
    label: '描述',
    options: {
      filter: false,
      sort: false,
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

export default function OrganizationTransactionApplicationTable({
  title = '點數申請',
  description,
  organizationId,
  id,
  nested,
  data: inData,
  onRefresh,
}) {
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
    await request(updateOrganizationTransactionApplication, { input });

    Object.assign(data[dataIndex], input);
    setData([...data]);
  };


  useEffect(() => {
    if (!organizationId) return;

    (async () => {
      try {
        setIsLoading(true);
        const params = { organizationId };
        if (id) {
          params.id = { eq: id };
        }
        const records = (await asyncListAll(listOrganizationTransactionApplications, params));
        setData(records.sort(sortBy('createdAt', true)));
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [organizationId, id, lastUpdatedAt]);

  useEffect(() => {
    if (!inData) return;

    setData(inData);
  }, [inData]);

  return (
    <Table
      title={title}
      description={description}
      isLoading={isLoading}
      data={data}
      nested={nested}
      columns={columns}
      options={options}
      onUpdateItem={onUpate}
      onRefresh={() => {
        if (onRefresh) onRefresh();
        setLastUpdatedAt(Date.now());
      }}
    />
  );
}

OrganizationTransactionApplicationTable.propTypes = {
  organizationId: PropTypes.string.isRequired,
  id: PropTypes.string,
  nested: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  onRefresh: PropTypes.func,
  data: PropTypes.array,
};
