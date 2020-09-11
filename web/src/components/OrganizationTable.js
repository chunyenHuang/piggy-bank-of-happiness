import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { v1 as uuidv1 } from 'uuid';
import SyncIcon from '@material-ui/icons/Sync';

import Table from 'components/Table/Table';
// import LinkButton from 'components/Table/LinkButton';
import { listOrganizations } from 'graphql/queries';
import { updateOrganization, createOrganization } from 'graphql/mutations';
import { asyncListAll, request } from 'utilities/graph';
import { updateUserAttributes } from 'utilities/cognito';
import DetailFormDialog from 'components/DetailFormDialog';
import formMetadata from 'forms/Organization';

const title = '機構列表';
const description = '';

function OrganizationTable() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [open, setOpen] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState();

  const options = {};

  const currentOrgId = localStorage.getItem('app:organizationId');
  const username = localStorage.getItem('app:username');

  const switchOrg = async (organizationId) => {
    setIsLoading(true);
    await updateUserAttributes(username, {
      'custom:organizationId': organizationId,
      'custom:organizationName': data.find((x) => x.id === organizationId).name,
    });

    window.location.reload();
  };

  const columns = [
    {
      name: 'isActive',
      label: '狀態',
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
        filter: false,
        sort: false,
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
    {
      name: 'id',
      label: ' ',
      options: {
        display: true,
        filter: false,
        sort: false,
        customBodyRender(id) {
          return (
            <Button
              onClick={() => switchOrg(id)}
              disabled={id === currentOrgId}
              startIcon={<SyncIcon />}
            >
              切換
            </Button>
          );
        },
      },
    },
  ];

  const onUpate = async (item, dataIndex) => {
    const input = {
      id: item.id,
    };
    columns.forEach(({ name, edit }) => {
      if (edit) {
        input[name] = item[name];
      }
    });

    input.isActive = input.isActive ? 1 : 0;

    await request(updateOrganization, { input }, {});

    Object.assign(data[dataIndex], input);
    setData([...data]);
  };

  const onCreate = async (newRecord) => {
    try {
      setIsLoading(true);
      const input = Object.assign(newRecord, {});
      await request(createOrganization, { input });

      setLastUpdatedAt(Date.now());
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
        const records = (await asyncListAll(listOrganizations));
        setData(records);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [lastUpdatedAt]);

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
          title="新增機構"
          openOnInit={true}
          onClose={() => setOpen(false)}
          // details form props
          data={{
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

export default OrganizationTable;
