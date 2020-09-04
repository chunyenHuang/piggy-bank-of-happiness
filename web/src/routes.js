import { Route } from 'react-router-dom';

import ProtectedRoute from 'components/ProtectedRoute';

import UserDashboard from 'views/User/Dashboard/Dashboard';
// import AdminDashboard from 'views/Admin/Dashboard/Dashboard';
import Organizations from 'views/Admin/Organizations/Organizations';
import Organization from 'views/Admin/Organization/Organization';
import Users from 'views/Admin/Users/Users';

import OrganizationUsers from 'views/OrgAdmin/Users/Users';
import OrganizationPrograms from 'views/OrgAdmin/Programs/Programs';
import OrganizationTransactions from 'views/OrgAdmin/Transactions/Transactions';

export const general = [
].map((item) => {
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
    title: '人員列表',
    paths: [
      { path: '/users', exact: true },
    ],
    component: OrganizationUsers,
  },
  {
    title: '任務列表',
    paths: [
      { path: '/programs', exact: true },
    ],
    component: OrganizationPrograms,
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
  item.roles = ['OrgAdmins'];
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
  {
    title: '機構',
    paths: [
      { path: '/organization/:id', exact: true },
    ],
    component: Organization,
    hideFromMenu: true,
  },
  {
    title: '軟體用戶',
    paths: [
      { path: '/appUsers', exact: true },
    ],
    component: Users,
  },
].map((item) => {
  item.route = item.route || ProtectedRoute;
  item.roles = ['AppAdmins'];
  return item;
});

export const appRoutes = [
  ...general, ...user, ...orgAdmin, ...admin,
].reduce((all, item) => {
  item.paths.forEach(({ path, exact = true }) => {
    all.push(Object.assign({ path, exact }, item));
  });
  return all;
}, []);
