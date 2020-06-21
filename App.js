import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
// amplify
import Amplify, { Auth, Hub } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';
import Analytics from '@aws-amplify/analytics';

import './global';
import useCachedResources from './hooks/useCachedResources';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';
import Colors from './constants/Colors';
import authenticatorConfig from './authenticator.config';
import amplifyTheme from './constants/Amplify.theme';
import amplifyConfig from './amplify.config';
import paperTheme from './constants/Paper.theme';

import UserScreen from './screens/UserScreen';

Amplify.configure(amplifyConfig);
Analytics.disable();

const setupUser = async () => {
  console.log('setup user');
  const user = await Auth.currentAuthenticatedUser();
  // console.log(user);
  // user is not assigned to organization yet
  if (!user.attributes['custom:organizationId']) {
    return;
  }

  await AsyncStorage.setItem('organizationId', user.attributes['custom:organizationId']);
  await AsyncStorage.setItem('organizationName', user.attributes['custom:organizationName']);
  await AsyncStorage.setItem('name', user.attributes['name']);
  await AsyncStorage.setItem('email', user.attributes['email']);
  await AsyncStorage.setItem('username', user.username);
  await AsyncStorage.setItem('group', (user.signInUserSession.accessToken.payload['cognito:groups'][0] || 'N/A'));
  // console.log(await AsyncStorage.getAllKeys());
};

const Stack = createStackNavigator();

function App({ authState, onStateChange }) {
  console.log('App: authState: ', authState);
  const authListener = ({ payload: { event, data } }) => {
    console.log('auth event', event);

    switch (event) {
    case 'signIn':
      // setupUser();
      break;
    case 'signIn_failure':
      global.logger.warn(data);
      break;
    case 'signOut':
      // setUser(null);
      onStateChange && onStateChange('signedOut');
      break;
    case 'customOAuthState':
      // setCustomState(data);
    }
  };

  useEffect(() => {
    (async () => {
      Hub.listen('auth', authListener);
      await Promise.all([
        setupUser(),
      ]);
    })();

    return () => {
      console.log('unmount app.js');
      Hub.remove('auth', authListener);
    };
  }, []);

  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <PaperProvider theme={paperTheme}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
          <NavigationContainer linking={LinkingConfiguration}>
            <Stack.Navigator>
              <Stack.Screen name="Root" component={BottomTabNavigator} />
              <Stack.Screen name="User" component={UserScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
});

export default withAuthenticator(App, authenticatorConfig, undefined, undefined, amplifyTheme);

// export default (props) => {
//   const AppComponent = withAuthenticator(App, authenticatorConfig, undefined, undefined, amplifyTheme);
//   return <AppComponent {...props} />;
// };
