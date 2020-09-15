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
