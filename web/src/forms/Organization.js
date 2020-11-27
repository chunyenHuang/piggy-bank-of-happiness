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
      key: 'status',
      type: 'String',
      label: '狀態',
      isRequired: true,
      isDisabled: true,
    },
    {
      key: 'username',
      type: 'String',
      label: '申請人帳號',
      isRequired: true,
      isDisabled: true,
    },
    {
      key: 'name',
      type: 'String',
      label: '名稱',
      isRequired: true,
    },
    {
      key: 'registeredName',
      type: 'String',
      label: '政府立案名稱',
    },
    {
      key: 'description',
      type: 'String',
      label: '描述',
      isRequired: true,
    },
    {
      key: 'taxIdNumber',
      type: 'String',
      label: '統一編號',
    },
    {
      key: 'phoneNumber',
      type: 'String',
      label: '電話號碼',
    },
    {
      key: 'faxNumber',
      type: 'String',
      label: '傳真機號碼',
      isRequired: false,
    },
    {
      key: 'email',
      type: 'email',
      label: '電子信箱',
    },
    {
      key: 'address',
      type: 'Object',
      label: '地址',
      formType: 'Object',
      formObjects: [{
        key: 'zipCode',
        type: 'String',
        label: '郵遞區號',
      }, {
        key: 'county',
        type: 'String',
        label: '縣市',
      }, {
        key: 'district',
        type: 'String',
        label: '鄉鎮區',
      }, {
        key: 'street',
        type: 'String',
        label: '路名',
      }],
    },
    {
      key: 'principal',
      type: 'Object',
      label: '負責人',
      formType: 'Object',
      formObjects: [{
        key: 'name',
        type: 'String',
        label: '姓名',
      }, {
        key: 'title',
        type: 'String',
        label: '職稱',
      }, {
        key: 'phoneNumber',
        type: 'String',
        label: '電話',
      }, {
        key: 'email',
        type: 'email',
        label: '電子信箱',
      }],
    },
  ],
};
