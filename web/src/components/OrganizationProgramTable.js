import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { v1 as uuidv1 } from 'uuid';

import Table from 'components/Table/Table';
import NestedTableContainer from 'components/Table/NestedTableContainer';
import OrganizationTaskTable from 'components/OrganizationTaskTable';
import DetailFormDialog from 'components/DetailFormDialog';

import { listOrganizationPrograms } from 'graphql/queries';
import { createOrganizationProgram, updateOrganizationProgram } from 'graphql/mutations';
import { asyncListAll, request } from 'utilities/graph';
import { sortBy } from 'utilities/sorting';

import formMetadata from 'forms/OrganizationProgram';

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

export default function OrganizationProgramTable({ title = '任務類別', description, organizationId, id, nested }) {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const username = localStorage.getItem('app:username');

  const options = {
    expandableRows: true,
    isRowExpandable: () => true,
    renderExpandableRow(rowData, rowMeta) {
      const { id } = data[rowMeta.dataIndex];
      return (
        <NestedTableContainer columns={columns}>
          <OrganizationTaskTable programId={id} nested={true}/>
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

      await request(updateOrganizationProgram, { input });

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
      await request(createOrganizationProgram, { input });

      setLastUpdatedAt(Date.now());
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
        const params = { organizationId };
        if (id) {
          params.id = { eq: id };
        }
        const records = (await asyncListAll(listOrganizationPrograms, params));
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
        nested={nested}
        columns={columns}
        options={options}
        onAddItem={() => setOpen(true)}
        onUpdateItem={onUpate}
        onRefresh={() => setLastUpdatedAt(Date.now())}
      />
      {open &&
        <DetailFormDialog
          title="新增任務類別"
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

OrganizationProgramTable.propTypes = {
  organizationId: PropTypes.string.isRequired,
  id: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  nested: PropTypes.bool,
};
