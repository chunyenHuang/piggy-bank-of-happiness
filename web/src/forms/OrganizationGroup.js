export default {
  fields: [
    // {
    //   key: 'organizationId',
    //   type: 'String',
    //   label: '機構 ID',
    //   isRequired: true,
    //   isDisabled: true,
    // },
    // {
    //   key: 'id',
    //   type: 'String',
    //   label: 'ID',
    //   isRequired: true,
    //   isDisabled: true,
    // },
    {
      key: 'isActive',
      type: 'Number',
      label: '使用狀態',
      isRequired: true,
      formType: 'Radio',
      formOptions: [
        { label: '使用中', value: 1 },
        { label: '停用中', value: 0 },
      ],
    },
    {
      key: 'name',
      type: 'String',
      label: '名稱',
      isRequired: true,
    },
    {
      key: 'description',
      type: 'String',
      label: '描述',
      isRequired: false,
    },
  //   {
  //     key: 'createdBy',
  //     type: 'String',
  //     label: '創立者',
  //     isRequired: true,
  //     isDisabled: true,
  //   },
  ],
};
