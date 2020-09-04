import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { v1 as uuidv1 } from 'uuid';

import Table from 'components/Table/Table';
import DetailFormDialog from 'components/DetailFormDialog';
import { listOrganizationTasks, getOrgTasksByProgramByActive } from 'graphql/queries';
import { createOrganizationTask, updateOrganizationTask } from 'graphql/mutations';
import { asyncListAll, request } from 'utilities/graph';
import { sortBy } from 'utilities/sorting';

import formMetadata from 'forms/OrganizationTask';

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
    name: 'program.name',
    label: '類別',
    options: {
      display: false,
      filter: true,
      sort: true,
    },
  },
  {
    name: 'name',
    label: '名稱',
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
    name: 'note',
    label: '註記',
    edit: {
      type: 'text',
    },
    options: {
      display: false,
      filter: false,
      sort: false,
    },
  },
  {
    name: 'point',
    label: '點數',
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
    name: 'pointMin',
    label: '最低點數',
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
    name: 'pointMax',
    label: '最高點數',
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

function OrganizationTaskTable({ title = '任務列表', description, organizationId, programId }) {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const options = {};
  const username = localStorage.getItem('app:username');

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
      await request(updateOrganizationTask, { input });

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
      const input = Object.assign(newRecord, {});
      await request(createOrganizationTask, { input });

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
    (async () => {
      try {
        setIsLoading(true);
        let records;
        if (organizationId) {
          records = (await asyncListAll(listOrganizationTasks, { organizationId }));
        } else
        if (programId) {
          records = (await asyncListAll(getOrgTasksByProgramByActive, { programId }));
        }

        if (records) {
          setData(records.sort(sortBy('name')).sort(sortBy('isActive', true)));
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [organizationId, programId, lastUpdatedAt]);

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
          openOnInit={true}
          onClose={() => setOpen(false)}
          // details form props
          data={{
            organizationId: localStorage.getItem('app:organizationId'),
            programId,
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

OrganizationTaskTable.propTypes = {
  organizationId: PropTypes.string,
  programId: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default OrganizationTaskTable;
