import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { v1 as uuidv1 } from 'uuid';

import Table from 'components/Table/Table';

import DetailFormDialog from 'components/DetailFormDialog';

import { listOrganizationRewards } from 'graphql/queries';
import { createOrganizationReward, updateOrganizationReward } from 'graphql/mutations';
import { asyncListAll, request } from 'utilities/graph';
import { sortBy } from 'utilities/sorting';

import formMetadata from 'forms/OrganizationReward';

const columns = [
  {
    name: 'isActive',
    label: '使用中',
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
    label: '名稱',
    isTemplate: true,
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
    isTemplate: true,
    edit: {
      type: 'text',
    },
    options: {
      filter: false,
      sort: false,
    },
  },
  {
    name: 'requiredPoints',
    label: '所需點數',
    isTemplate: true,
    type: 'point',
    edit: {
      type: 'point',
    },
    options: {
      filter: false,
      sort: true,
    },
  },
  {
    name: 'total',
    label: '數量',
    isTemplate: true,
    type: 'number',
    edit: {
      type: 'number',
    },
    options: {
      filter: false,
      sort: true,
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

export default function OrganizationRewardTable({ title = '獎品', description, organizationId }) {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const username = localStorage.getItem('app:username');

  const options = {};

  const onUpate = async (item, dataIndex) => {
    try {
      setIsLoading(true);
      const input = {
        organizationId: item.organizationId,
        id: item.id,
      };
      columns.forEach(({ name, edit }) => {
        if (edit) {
          input[name] = item[name];
        }
      });

      input.isActive = input.isActive ? 1 : 0;

      await request(updateOrganizationReward, { input });

      Object.assign(data[dataIndex], input, {
        updatedBy: username,
      });

      setData([...data]);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onCreate = async (newRecord) => {
    try {
      setIsLoading(true);
      const input = Object.assign(newRecord, {
        createdBy: username,
        updatedBy: username,
        requiredPoints: +(parseFloat(newRecord.requiredPoints) * 100),
      });
      await request(createOrganizationReward, { input });

      setOpen(false);
      setLastUpdatedAt(Date.now());
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const onBatchAdd = async (items) => {
    try {
      setIsLoading(true);
      const promises = items.map((item) => {
        const input = Object.assign(item, {
          organizationId,
          id: uuidv1(),
          isActive: 1,
          requiredPoints: +(parseFloat(item.requiredPoints) * 100),
          createdBy: username,
          updatedBy: username,
        });

        return request(createOrganizationReward, { input });
      });

      await Promise.all(promises);
      setLastUpdatedAt(Date.now());
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!organizationId) return;

    (async () => {
      try {
        setIsLoading(true);
        const records = (await asyncListAll(listOrganizationRewards, { organizationId }));
        setData(records.sort(sortBy('name')).sort(sortBy('isActive', true)));
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
        onAddItem={() => setOpen(true)}
        onBatchAdd={onBatchAdd}
        onUpdateItem={onUpate}
        onRefresh={() => setLastUpdatedAt(Date.now())}
      />
      {open &&
        <DetailFormDialog
          title="新增獎品"
          openOnInit={true}
          onClose={() => setOpen(false)}
          // details form props
          data={{
            organizationId,
            id: uuidv1(),
            isActive: 1,
          }}
          metadata={formMetadata}
          isLoading={isLoading}
          onSubmit={onCreate}
        />}
    </React.Fragment>
  );
}

OrganizationRewardTable.propTypes = {
  organizationId: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
};
