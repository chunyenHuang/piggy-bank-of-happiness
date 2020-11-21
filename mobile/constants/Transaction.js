import Colors from 'constants/Colors';

export const getPropsByType = (type) => {
  let props;
  switch (type) {
  case 'withdraw':
    props = {
      label: '提款',
      color: Colors.error,
      icon: 'credit-card',
      iconType: 'font-awesome-5',
    };
    break;
  case 'reward':
    props = {
      label: '兌換',
      color: Colors.accent,
      icon: 'gift',
      iconType: 'font-awesome-5',
    };
    break;
  case 'adjustment':
    props = {
      label: '調整',
      color: Colors.dark,
      icon: 'pen',
      iconType: 'font-awesome-5',
    };
    break;
  case 'cancel':
    props = {
      label: '取消',
      color: Colors.light,
      icon: 'ban',
      iconType: 'font-awesome-5',
    };
    break;
  case 'tasks':
  case 'credits':
  default:
    props = {
      label: '新增',
      color: Colors.alternative,
      icon: 'tasks',
      iconType: 'font-awesome-5',
    };
    break;
  }
  return props;
};

export const getPropsByStatus = (status) => {
  let props;
  switch (status) {
  case 'Pending':
    props = {
      key: status,
      label: '審核中',
      color: Colors.accent,
      icon: 'search',
      iconType: 'font-awesome-5',
    };
    break;
  case 'Rejected':
    props = {
      key: status,
      label: '已拒絕',
      color: Colors.error,
      icon: 'times',
      iconType: 'font-awesome-5',
    };
    break;
  case 'Approved':
  default:
    props = {
      key: status,
      label: '已通過',
      color: Colors.alternative,
      icon: 'check',
      iconType: 'font-awesome-5',
    };
    break;
  }
  return props;
};
