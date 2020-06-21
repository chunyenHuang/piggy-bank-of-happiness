import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
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

Amplify.configure(amplifyConfig);
Analytics.disable();

const setupUser = async () => {
  const user = await Auth.currentAuthenticatedUser();
  console.log(user);
  // await AsyncStorage.setItem('userData', JSON.stringify(userData));
};

const Stack = createStackNavigator();

function App({ authState, onStateChange }) {
  console.log(authState);
  const authListener = ({ payload: { event, data } }) => {
    console.log('auth event', event);

    switch (event) {
    case 'signIn':
      // setUser(data);
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
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
        <NavigationContainer linking={LinkingConfiguration}>
          <Stack.Navigator>
            <Stack.Screen name="Root" component={BottomTabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
});

export default (props) => {
  const AppComponent = withAuthenticator(App, authenticatorConfig, undefined, undefined, amplifyTheme);
  return <AppComponent {...props} />;
};
