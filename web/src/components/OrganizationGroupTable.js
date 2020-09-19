import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { v1 as uuidv1 } from 'uuid';

import Table from 'components/Table/Table';
import NestedTableContainer from 'components/Table/NestedTableContainer';
import OrganizationUserTable from 'components/OrganizationUserTable';
import DetailFormDialog from 'components/DetailFormDialog';

import { listOrganizationGroups } from 'graphql/queries';
import { createOrganizationGroup, updateOrganizationGroup } from 'graphql/mutations';
import { asyncListAll, request } from 'utilities/graph';
import { sortBy } from 'utilities/sorting';

import formMetadata from 'forms/OrganizationGroup';

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
    label: '班級名稱',
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
    name: 'createdBy',
    label: '創立者',
    options: {
      display: false,
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

export default function OrganizationGroupTable({ title = '班級', description, organizationId }) {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const username = localStorage.getItem('app:username');

  const options = {
    expandableRows: true,
    isRowExpandable: () => true,
    renderExpandableRow(rowData, rowMeta) {
      const { organizationId, id } = data[rowMeta.dataIndex];
      return (
        <NestedTableContainer columns={columns}>
          <OrganizationUserTable
            title="學生列表"
            organizationId={organizationId}
            groupId={id}
            roles={['User']}
            nested={true}
          />
        </NestedTableContainer>
      );
    },
  };

  const onUpate = async (item, dataIndex) => {
    try {
      setIsLoading(true);
      const input = {
        organizationId: item.organizationId,
        id: item.id,
        updatedBy: localStorage.getItem('app:username'),
      };
      columns.forEach(({ name, edit }) => {
        if (edit) {
          input[name] = item[name];
        }
      });

      input.isActive = input.isActive ? 1 : 0;

      await request(updateOrganizationGroup, { input });

      Object.assign(data[dataIndex], input);
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
        createdBy: localStorage.getItem('app:username'),
        updatedBy: localStorage.getItem('app:username'),
      });
      await request(createOrganizationGroup, { input });

      data.unshift(input);
      setData([...data]);
      setOpen(false);
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
        const records = (await asyncListAll(listOrganizationGroups, { organizationId }));
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
        onUpdateItem={onUpate}
        onRefresh={() => setLastUpdatedAt(Date.now())}
      />
      {open &&
        <DetailFormDialog
          title="新增班級"
          openOnInit={true}
          onClose={() => setOpen(false)}
          // details form props
          data={{
            organizationId,
            id: uuidv1(),
            createdBy: username,
            isActive: 1,
          }}
          metadata={formMetadata}
          isLoading={isLoading}
          onSubmit={onCreate}
        />}
    </React.Fragment>
  );
}

OrganizationGroupTable.propTypes = {
  organizationId: PropTypes.string.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
};
