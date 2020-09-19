import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Table from 'components/Table/Table';
// import LinkButton from 'components/Table/LinkButton';
import { listEvents, getEventsByOrgByTimestamp } from 'graphql/queries';
import { request } from 'utilities/graph';
import { sortBy } from 'utilities/sorting';

const title = '系統紀錄';
const description = '';

const ignoreDiffKey = [
  'createdAt', 'updatedAt', 'updatedBy', 'createdBy',
];

export default function EventTable({ organizationId }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [lastUpdatedAt, setLastUpdatedAt] = useState();

  const options = {};

  const columns = [
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
      },
    },
    {
      name: 'partitionKey',
      label: 'ID',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'sortKey',
      label: 'Sort Key',
      options: {
        filter: false,
        sort: true,
      },
    },
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
      name: 'eventName',
      label: '類別',
      options: {
        filter: true,
        sort: true,
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
      label: '內容',
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
                  {diff.old && <td>{diff.old.replace(/"/g, '')}</td>}
                  {diff.new && <td>{diff.new.replace(/"/g, '')}</td>}
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
