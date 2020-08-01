export const getGroupNames = () => {
  return [
    'AppAdmins',
    'OrgAdmins',
    'OrgManagers',
    'Users',
  ];
};

export const getGroupDisplayName = (inGroupName) => {
  switch (inGroupName) {
  case 'AppAdmins':
    return '系統管理員';
  case 'OrgAdmins':
    return '管理員';
  case 'OrgManagers':
    return '行政人員';
  case 'Users':
    return '用戶';
  default:
    return '-';
  }
};

export const getRoleDisplayName = (inRoleName) => {
  switch (inRoleName) {
  case 'Admin':
    return '管理員';
  case 'Manager':
    return '行政人員';
  case 'User':
    return '用戶';
  default:
    return '-';
  }
};
