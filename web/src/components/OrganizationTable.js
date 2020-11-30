import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { v1 as uuidv1 } from 'uuid';
import SyncIcon from '@material-ui/icons/Sync';

import Table from 'components/Table/Table';
import NestedTableContainer from 'components/Table/NestedTableContainer';
import { listOrganizations } from 'graphql/queries';
import { updateOrganization, createOrganization } from 'graphql/mutations';
import { asyncListAll, request } from 'utilities/graph';
import { updateUserAttributes } from 'utilities/cognito';
import orgApplicationStatusMenu from 'constants/orgApplicationStatus';
import orgIsActiveMenu from 'constants/orgIsActive';
import DetailFormDialog from 'components/DetailFormDialog';
import formMetadata from 'forms/Organization';
import Organization from 'views/Admin/Organization/Organization';
import { renderFromMenu } from 'utilities/format';
import LinkButton from 'components/Table/LinkButton';

const title = '機構列表';
const description = '';

function OrganizationTable() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const [open, setOpen] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState();

  const options = {
    expandableRows: true,
    isRowExpandable: () => true,
    renderExpandableRow(rowData, rowMeta) {
      const { id } = data[rowMeta.dataIndex];
      return (
        <NestedTableContainer columns={columns}>
          <Organization id={id} />
        </NestedTableContainer>
      );
    },
  };

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
      name: 'status',
      label: '申請狀態',
      edit: {
        type: 'select',
        menu: orgApplicationStatusMenu,
      },
      options: {
        filter: true,
        sort: true,
        customBodyRender: renderFromMenu(orgApplicationStatusMenu),
      },
    },
    {
      name: 'isActive',
      label: '使用狀態',
      edit: {
        type: 'select',
        menu: orgIsActiveMenu,
      },
      options: {
        filter: true,
        sort: true,
        customBodyRender: renderFromMenu(orgIsActiveMenu),
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
      edit: {
        type: 'text',
      },
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'registeredName',
      label: '立案名稱',
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
        display: false,
        filter: false,
        sort: false,
      },
    },
    {
      name: 'taxIdNumber',
      label: '統一編號',
      edit: {
        type: 'text',
      },
      options: {
        display: false,
        filter: false,
        sort: true,
      },
    },
    {
      name: 'phoneNumber',
      label: '電話號碼',
      edit: {
        type: 'text',
      },
      options: {
        filter: false,
        sort: true,
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
      name: 'principal.name',
      label: '負責人',
      options: {
        filter: false,
        sort: true,
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
        display: false,
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
        display: false,
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
    {
      name: 'id',
      label: ' ',
      options: {
        display: true,
        filter: false,
        sort: false,
        customBodyRender(id) {
          return (
            <LinkButton
              path={`/organization/${id}`}
              label="前往機構頁面"
            />
          );
        },
      },
    },
  ];

  const onUpate = async (item, dataIndex) => {
    const input = {
      id: item.id,
      updatedBy: username,
    };
    columns.forEach(({ name, edit }) => {
      if (edit) {
        input[name] = item[name];
      }
    });

    input.isActive = input.isActive ? 1 : 0;

    await request(updateOrganization, { input });

    Object.assign(data[dataIndex], input);
    setData([...data]);
  };

  const onCreate = async (newRecord) => {
    try {
      setIsLoading(true);
      const input = Object.assign(newRecord, {
        createdBy: username,
        updatedBy: username,
      });
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
