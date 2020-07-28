import { Route } from 'react-router-dom';

import ProtectedRoute from 'components/ProtectedRoute';

import UserDashboard from 'views/User/Dashboard/Dashboard';
import AdminDashboard from 'views/Admin/Dashboard/Dashboard';

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

export const admin = [
  {
    title: '幸福存摺',
    paths: [
      { path: '/', exact: true },
      { path: '/dashboard', exact: true },
    ],
    component: AdminDashboard,
  },
].map((item) => {
  item.route = item.route || ProtectedRoute;
  item.roles = ['OrgAdmins', 'AppAdmins'];
  return item;
});

export const appRoutes = [
  ...general, ...user, ...admin,
].reduce((all, item) => {
  item.paths.forEach(({ path, exact = true }) => {
    all.push(Object.assign({ path, exact }, item));
  });
  return all;
}, []);
