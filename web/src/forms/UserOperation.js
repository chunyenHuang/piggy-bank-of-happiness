import roles from 'constants/roles';

export default {
  fields: [
    {
      key: 'organizationId',
      type: 'String',
      label: '機構 ID',
      isRequired: true,
      isDisabled: true,
    },
    {
      key: 'groupId',
      type: 'String',
      label: '班級 ID',
      isRequired: false,
    },
    {
      key: 'username',
      type: 'String',
      label: '帳號',
      isRequired: true,
    },
    {
      key: 'idNumber',
      type: 'String',
      label: '學號',
      isRequired: false,
    },
    {
      key: 'name',
      type: 'String',
      label: '姓名 ',
      isRequired: true,
    },
    {
      key: 'email',
      type: 'String',
      label: 'Email',
      isRequired: true,
    },
    {
      key: 'role',
      type: 'String',
      label: '職位',
      isRequired: true,
      formType: 'Radio',
      formOptions: roles,
    },
  ],
};
