import { Route } from 'react-router-dom';

import ProtectedRoute from 'components/ProtectedRoute';

// User
import UserDashboard from 'views/User/Dashboard/Dashboard';

// AppAdmin
// import AdminDashboard from 'views/Admin/Dashboard/Dashboard';
import Organizations from 'views/Admin/Organizations/Organizations';
// import Organization from 'views/Admin/Organization/Organization';
import AppUsers from 'views/Admin/AppUsers/AppUsers';

// OrgAdmin
import OrganizationUsers from 'views/OrgAdmin/Users/Users';
import OrganizationPrograms from 'views/OrgAdmin/Programs/Programs';
import OrganizationTransactions from 'views/OrgAdmin/Transactions/Transactions';
import OrganizationGroups from 'views/OrgAdmin/Groups/Groups';


export const general = [].map((item) => {
  item.route = item.route || Route;
  return item;
});

export const user = [
  {
    title: '幸福存摺',
    paths: [
      { path: '/', exact: true },
      { path: '/dashboard', exact: true },
    ],
    component: UserDashboard,
  },
].map((item) => {
  item.route = item.route || ProtectedRoute;
  item.roles = ['Users'];
  return item;
});

export const orgAdmin = [
  {
    title: '班級',
    paths: [
      { path: '/groups', exact: true },
    ],
    component: OrganizationGroups,
  },
  {
    title: '任務',
    paths: [
      { path: '/programs', exact: true },
    ],
    component: OrganizationPrograms,
  },
  {
    title: '學生',
    paths: [
      {
        path: '/users',
        link: '/users?title=學生&roles[]=User',
        exact: true,
      },
    ],
    component: OrganizationUsers,
  },
  {
    title: '職員',
    paths: [
      {
        path: '/users',
        link: '/users?title=職員&roles[]=Admin&roles[]=Manager',
        exact: true,
      },
    ],
    component: OrganizationUsers,
  },
  {
    title: '交易紀錄',
    paths: [
      { path: '/transactions', exact: true },
    ],
    component: OrganizationTransactions,
  },
].map((item) => {
  item.route = item.route || ProtectedRoute;
  item.roles = ['OrgAdmins', 'AppAdmins'];
  return item;
});

export const admin = [
  // {
  //   title: '首頁',
  //   paths: [
  //     { path: '/', exact: true },
  //     { path: '/dashboard', exact: true },
  //   ],
  //   component: AdminDashboard,
  //   hideFromMenu: true,
  // },
  {
    title: '機構',
    paths: [
      { path: '/organizations', exact: true },
    ],
    component: Organizations,
  },
  // {
  //   title: '機構',
  //   paths: [
  //     { path: '/organization/:id', exact: true },
  //   ],
  //   component: Organization,
  //   hideFromMenu: true,
  // },
  {
    title: '軟體用戶',
    paths: [
      { path: '/appUsers', exact: true },
    ],
    component: AppUsers,
  },
].map((item) => {
  item.route = item.route || ProtectedRoute;
  item.roles = ['AppAdmins'];
  return item;
});

export const appRoutes = [
  ...general, ...admin, ...orgAdmin, ...user,
].reduce((all, item) => {
  item.paths.forEach(({ path, link, exact = true }) => {
    all.push(Object.assign({ path, link, exact }, item));
  });
  return all;
}, []);
