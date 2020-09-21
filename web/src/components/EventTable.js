import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Table from 'components/Table/Table';
// import LinkButton from 'components/Table/LinkButton';
import { listEvents, getEventsByOrgByTimestamp } from 'graphql/queries';
import { request } from 'utilities/graph';
import { sortBy } from 'utilities/sorting';
import NestedTableContainer from 'components/Table/NestedTableContainer';
import OrganizationGroupTable from 'components/OrganizationGroupTable';
import OrganizationProgramTable from 'components/OrganizationProgramTable';
import OrganizationUserTable from 'components/OrganizationUserTable';
// import OrganizationUserTask from 'components/OrganizationUserTask';
import OrganizationTransactionTable from 'components/OrganizationTransactionTable';
import OrganizationRewardTable from 'components/OrganizationRewardTable';

const title = '系統紀錄';
const description = '';

const ignoreDiffKey = [
  'createdAt', 'updatedAt', 'updatedBy', 'createdBy',
];
const tableNames = {
  OrganizationGroup: '班級',
  OrganizationProgram: '任務類別',
  OrganizationUser: '使用者',
  OrganizationUserTask: '使用者任務',
  OrganizationTransaction: '交易紀錄',
  OrganizationReward: '獎品',
};

export default function EventTable({ organizationId }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [lastUpdatedAt, setLastUpdatedAt] = useState();

  const options = {
    expandableRows: true,
    isRowExpandable: () => true,
    renderExpandableRow(rowData, rowMeta) {
      const { table, partitionKey, sortKey } = data[rowMeta.dataIndex];
      let component;
      const title = tableNames[table] || table;
      switch (table) {
      case 'OrganizationGroup':
        component =
          <OrganizationGroupTable
            title={title}
            organizationId={partitionKey}
            id={sortKey}
            nested={true}
          />;
        break;
      case 'OrganizationProgram':
        component =
          <OrganizationProgramTable
            title={title}
            organizationId={partitionKey}
            id={sortKey}
            nested={true}
          />;
        break;
      case 'OrganizationUser':
        component =
          <OrganizationUserTable
            title={title}
            organizationId={partitionKey}
            username={sortKey}
            nested={true}
          />;
        break;
      case 'OrganizationTransaction':
        component =
          <OrganizationTransactionTable
            title={title}
            organizationId={partitionKey}
            id={sortKey}
            nested={true}
          />;
        break;
      case 'OrganizationReward':
        component =
          <OrganizationRewardTable
            title={title}
            organizationId={partitionKey}
            id={sortKey}
            nested={true}
          />;
        break;
      default:
        component = (<div />);
      }
      return (
        <NestedTableContainer columns={columns}>
          {component}
        </NestedTableContainer>
      );
    },
  };

  const columns = [
    {
      name: 'timestamp',
      label: '紀錄時間',
      type: 'datetime',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'key',
      label: 'Key',
      options: {
        display: false,
        filter: false,
        sort: true,
      },
    },
    {
      name: 'table',
      label: '資料庫',
      options: {
        filter: true,
        sort: true,
        customBodyRender(value) {
          return tableNames[value] || value;
        },
      },
    },
    {
      name: 'partitionKey',
      label: 'ID',
      options: {
        display: false,
        filter: false,
        sort: true,
      },
    },
    {
      name: 'sortKey',
      label: 'Sort Key',
      options: {
        display: false,
        filter: false,
        sort: true,
      },
    },
    {
      name: 'eventName',
      label: '類別',
      options: {
        filter: true,
        sort: true,
        customBodyRender(value) {
          switch (value) {
          case 'INSERT':
            return '新增';
          case 'MODIFY':
            return '更新';
          case 'REMOVE':
            return '刪除';
          }
        },
      },
    },
    {
      name: 'updatedBy',
      label: '更新者',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'diff',
      label: '變更內容',
      options: {
        filter: false,
        sort: false,
        customBodyRender(value = []) {
          const diffs = value.filter(({ key }) => !ignoreDiffKey.includes(key));

          if (diffs.length === 0) return null;

          return (<table>
            <thead>
              <tr>
                <th>欄位</th>
                <th>舊資料</th>
                <th>新資料</th>
              </tr>
            </thead>
            <tbody>
              {diffs.map((diff, index)=>(
                <tr key={index}>
                  <td>{diff.key}</td>
                  <td>{(diff.old || '').replace(/"/g, '')}</td>
                  <td>{(diff.new || '').replace(/"/g, '')}</td>
                </tr>
              ))}
            </tbody>
          </table>);
        },
      },
    },
  ];

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        let records;
        if (organizationId) {
          const { data: { getEventsByOrgByTimestamp: { items } } } = await request(getEventsByOrgByTimestamp, {
            organizationId,
            sortDirection: 'DESC',
            limit: 100,
          });
          records = items;
        } else {
          const { data: { listEvents: { items } } } = await request(listEvents, { limit: 100 });
          records = items;
        }

        setData(records
          .sort(sortBy('timestamp', true))
          .map((item) => {
            const [table, partitionKey, sortKey] = item.key.split('__');
            item.table = table.split('-')[0];
            item.partitionKey = partitionKey;
            item.sortKey = sortKey;
            return item;
          }));
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [organizationId, lastUpdatedAt]);

  return (
    <React.Fragment>
      <Table
        title={title}
        isLoading={isLoading}
        description={description}
        data={data}
        columns={columns}
        options={options}
        onRefresh={() => setLastUpdatedAt(Date.now())}
      />
    </React.Fragment>
  );
}

EventTable.propTypes = {
  organizationId: PropTypes.string,
};
