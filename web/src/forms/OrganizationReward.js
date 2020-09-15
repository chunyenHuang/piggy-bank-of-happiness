export default {
  fields: [
    {
      key: 'id',
      type: 'String',
      label: '機構 ID',
      isRequired: true,
      isDisabled: true,
    },
    {
      key: 'isActive',
      type: 'Number',
      label: '使用中',
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
      isRequired: true,
    },
    {
      key: 'requiredPoints',
      type: 'Number',
      label: '所需點數',
      isRequired: true,
    },
    {
      key: 'total',
      type: 'Number',
      label: '數量',
      isRequired: true,
    },
  ],
};
