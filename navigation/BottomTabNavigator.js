import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import UserListScreen from '../screens/UserListScreen';
import TaskListScreen from '../screens/TaskListScreen';
import UserTransactionListScreen from '../screens/UserTransactionListScreen';

const BottomTab = createBottomTabNavigator();

const defaultMenu = [
  {
    name: 'Home',
    component: HomeScreen,
    // title: '幸福存摺 @ {{organizationName}}',
    title: '幸福存摺',
    options: {
      title: '首頁',
      tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-home" />,
    },
    groups: ['All'],
  },
  {
    name: 'UserList',
    component: UserListScreen,
    title: '學生列表',
    options: {
      title: '學生',
      tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-people" />,
    },
    groups: ['AppAdmins', 'OrgAdmins', 'OrgManagers'],
  },
  // {
  //   name: 'UserTransactionList',
  //   component: UserTransactionListScreen,
  //   title: '我的存摺',
  //   options: {
  //     title: '存摺',
  //     tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
  //   },
  //   groups: ['AppAdmins', 'OrgAdmins', 'OrgManagers', 'N/A'],
  // },
  {
    name: 'TaskList',
    component: TaskListScreen,
    title: '任務列表',
    options: {
      title: '任務',
      tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-star" />,
    },
    groups: ['AppAdmins', 'OrgAdmins', 'OrgManagers', 'User'],
  },
  {
    name: 'Settings',
    component: SettingsScreen,
    title: '個人設定',
    options: {
      title: '設定',
      tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-settings" />,
    },
    groups: ['All'],
  },
];

const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  const [organizationName, setOrganizationName] = useState('');
  const [menu, setMenu] = useState(defaultMenu.filter(({ groups }) => groups.includes('All')));
  console.log('BottomTabNavigator load');
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({ headerTitle: getHeaderTitle(route, organizationName) });

  useEffect(() => {
    (async () => {
      const [organizationName, group] = await Promise.all([
        AsyncStorage.getItem('app:organizationName'),
        AsyncStorage.getItem('app:group'),
      ]);
      setMenu(defaultMenu.filter(({ groups }) => groups.includes(group) || groups.includes('All')));
      setOrganizationName(organizationName);
    })();
  }, []);

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      {
        menu.map(({ name, component, options })=>(
          <BottomTab.Screen
            key={name}
            name={name}
            component={component}
            options={options}
          />
        ))
      }
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route, organizationName) {
  /* beautify ignore:start */
  const routeName = route.state?.routes[route.state.index]?.name??INITIAL_ROUTE_NAME;
  /* beautify ignore:end */

  return defaultMenu
    .find(({ name }) => name === routeName).title
    .replace('{{organizationName}}', organizationName);
}
