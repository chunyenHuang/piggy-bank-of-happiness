import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useState, useEffect } from 'react';
import { AsyncStorage } from 'react-native';
import { Header } from 'react-native-elements';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import UserListScreen from '../screens/UserListScreen';
import TaskListScreen from '../screens/TaskListScreen';
// import UserTransactionListScreen from '../screens/UserTransactionListScreen';
import StaffListScreen from '../screens/StaffListScreen';
// import Colors from '../constants/Colors';
import ModifyUser from '../components/ModifyUser';
import ModifyTask from '../components/ModifyTask';
import CognitoUserListScreen from '../screens/CognitoUserListScreen';

const BottomTab = createBottomTabNavigator();

const defaultMenu = [
  {
    name: 'Home',
    component: HomeScreen,
    // title: '幸福存摺 @ {{organizationName}}',
    title: '幸福存摺',
    rightComponent: null,
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
    rightComponent: <ModifyUser />,
    options: {
      title: '學生',
      tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-people" />,
    },
    groups: ['AppAdmins', 'OrgAdmins', 'OrgManagers'],
  },
  {
    name: 'StaffList',
    component: StaffListScreen,
    rightComponent: null,
    title: '職員列表',
    options: {
      title: '職員',
      tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-contacts" />,
    },
    groups: ['AppAdmins', 'OrgAdmins'],
  },
  {
    name: 'CognitoUserList',
    component: CognitoUserListScreen,
    rightComponent: null,
    title: 'APP註冊列表',
    options: {
      title: '用戶',
      tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-lock" />,
    },
    groups: ['AppAdmins'],
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
    rightComponent: <ModifyTask />,
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
    rightComponent: null,
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
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({
    header: (...args) => {
      const { title, rightComponent } = getHeaderProps(route, organizationName);
      return (
        /* beautify ignore:start */
        <Header
          statusBarProps={{ barStyle: 'dark-content' }}
          barStyle="light-content"
          // leftComponent={{ icon: 'menu', color: '#fff' }}
          centerComponent={{
            text: title,
            style: { color: '#fff', fontSize: 16 },
          }}
          rightComponent={rightComponent}
        />
        /* beautify ignore:end */
      );
    },
  });

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

function getHeaderProps(route, organizationName) {
  /* beautify ignore:start */
  const routeName = route.state?.routes[route.state.index]?.name??INITIAL_ROUTE_NAME;
  /* beautify ignore:end */

  const { title, rightComponent } = defaultMenu.find(({ name }) => name === routeName);

  return {
    title: title.replace('{{organizationName}}', organizationName),
    rightComponent,
  };
}
