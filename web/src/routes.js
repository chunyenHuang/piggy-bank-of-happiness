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
import OrganizationRewards from 'views/OrgAdmin/Rewards/Rewards';
import Events from 'views/OrgAdmin/Events/Events';

import ListIcon from '@material-ui/icons/List';
import GroupWorkIcon from '@material-ui/icons/GroupWork';
import PeopleIcon from '@material-ui/icons/People';
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle';
import PaymentIcon from '@material-ui/icons/Payment';
import BusinessIcon from '@material-ui/icons/Business';
import LockIcon from '@material-ui/icons/Lock';
import RedeemIcon from '@material-ui/icons/Redeem';
import EventNote from '@material-ui/icons/EventNote';

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

export const orgManager = [
  {
    title: '班級',
    icon: GroupWorkIcon,
    paths: [
      { path: '/groups', exact: true },
    ],
    component: OrganizationGroups,
  },
  {
    title: '任務',
    icon: ListIcon,
    paths: [
      { path: '/programs', exact: true },
    ],
    component: OrganizationPrograms,
  },
  {
    title: '學生',
    icon: PeopleIcon,
    paths: [
      {
        path: '/users',
        link: '/users?' + [
          'title=學生',
          'roles[]=User',
          'hide[]=role',
        ].join('&'),
        exact: true,
      },
    ],
    component: OrganizationUsers,
  },
].map((item) => {
  item.route = item.route || ProtectedRoute;
  item.roles = ['OrgManagers'];
  return item;
});

export const orgAdmin = [
  {
    title: '班級',
    icon: GroupWorkIcon,
    paths: [
      { path: '/groups', exact: true },
    ],
    component: OrganizationGroups,
  },
  {
    title: '任務',
    icon: ListIcon,
    paths: [
      { path: '/programs', exact: true },
    ],
    component: OrganizationPrograms,
  },
  {
    title: '獎品',
    icon: RedeemIcon,
    paths: [
      { path: '/rewards', exact: true },
    ],
    component: OrganizationRewards,
  },
  {
    title: '學生',
    icon: PeopleIcon,
    paths: [
      {
        path: '/users',
        link: '/users?' + [
          'title=學生',
          'roles[]=User',
          'hide[]=role',
        ].join('&'),
        exact: true,
      },
    ],
    component: OrganizationUsers,
  },
  {
    title: '職員',
    icon: SupervisedUserCircleIcon,
    paths: [
      {
        path: '/users',
        link: '/users?' + [
          'title=職員',
          'roles[]=Admin',
          'roles[]=Manager',
          'hide[]=idNumber',
          'hide[]=currentPoints',
          'hide[]=earnedPoints',
          'hide[]=groupId',
        ].join('&'),
        exact: true,
      },
    ],
    component: OrganizationUsers,
  },
  {
    title: '交易紀錄',
    icon: PaymentIcon,
    paths: [
      { path: '/transactions', exact: true },
    ],
    component: OrganizationTransactions,
  },
  {
    title: '系統紀錄',
    icon: EventNote,
    paths: [
      { path: '/events', exact: true },
    ],
    component: Events,
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
    icon: BusinessIcon,
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
    icon: LockIcon,
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
  ...general, ...admin, ...orgAdmin, ...orgManager, ...user,
].reduce((all, item) => {
  item.paths.forEach(({ path, link, exact = true }) => {
    all.push(Object.assign({ path, link, exact }, item));
  });
  return all;
}, []);
