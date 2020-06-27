const ADMINS = ['AppAdmins', 'OrgAdmins'];
const MANAGERS = ['AppAdmins', 'OrgAdmins', 'OrgManagers'];
const ALL = ['AppAdmins', 'OrgAdmins', 'OrgManagers', 'Users', 'N/A'];

export const PERMISSIONS = {
  DEMO: ALL,

  ORG_USER__UPDATE: MANAGERS,
  ORG_USER__CREATE: MANAGERS,
  ORG_USER__SUBSCRIPTION: MANAGERS,

  ORG_TX__CANCEL: MANAGERS,
  ORG_TX__UPDATE: ADMINS,
  ORG_TX__CREATE: ADMINS,
  ORG_TX__SUBSCRIPTION: ADMINS,
};
