import Colors from 'constants/Colors';

export default [
  {
    label: '新申請',
    value: 'Pending',
    color: Colors.focused,
  },
  {
    label: '審核中',
    value: 'InReview',
    color: Colors.alternative,
  },
  {
    label: '需補齊文件',
    value: 'WaitingForAdditionalDocuments',
    color: Colors.raised,
  },
  {
    label: '通過',
    value: 'Approved',
    color: Colors.dark,
  },
  {
    label: '拒絕',
    value: 'Rejected',
    color: Colors.light,
  },
];
