import roles from 'constants/roles';

export default (groupsMenu = []) => ({
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
      label: '班級',
      isRequired: false,
      formType: 'select',
      formOptions: groupsMenu,
    },
    {
      key: 'username',
      type: 'String',
      label: '帳號',
      isRequired: true,
    },
    {
      key: 'password',
      type: 'String',
      label: '密碼 （至少8碼）',
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
});
