import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AsyncStorage } from 'react-native';

import CustomHeader from 'components/CustomHeader';

import routes from './routes';

const filterRoutes = routes.filter((x) => x.type === 'bottom-tab');

const BottomTab = createBottomTabNavigator();

const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  const [organizationName, setOrganizationName] = useState('');
  const [menu, setMenu] = useState(filterRoutes.filter(({ groups }) => groups.includes('All')));
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html
  navigation.setOptions({
    header: () => {
      const { title, rightComponent } = getHeaderProps(route, organizationName);
      return (
        <CustomHeader title={title} rightComponent={rightComponent} />
      );
    },
  });

  useEffect(() => {
    (async () => {
      console.log('load menu...');
      const [organizationName, group] = await Promise.all([
        AsyncStorage.getItem('app:organizationName'),
        AsyncStorage.getItem('app:group'),
      ]);
      setMenu(filterRoutes.filter(({ groups }) => groups.includes(group) || groups.includes('All')));
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

  const { title, rightComponent } = filterRoutes.find(({ name }) => name === routeName);

  return {
    title: title.replace('{{organizationName}}', organizationName),
    rightComponent,
  };
}
