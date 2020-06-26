import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
// amplify
import Amplify, { Auth, Hub, Storage } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';
import Analytics from '@aws-amplify/analytics';

import './global';
import useCachedResources from './hooks/useCachedResources';
import BottomTabNavigator from './navigation/BottomTabNavigator';
import LinkingConfiguration from './navigation/LinkingConfiguration';
// import Colors from './constants/Colors';
import authenticatorConfig from './authenticator.config';
import amplifyTheme from './constants/Amplify.theme';
import amplifyConfig from './amplify.config';
import paperTheme from './constants/Paper.theme';
import Loading from './components/Loading';

import UserScreen from './screens/UserScreen';

Amplify.configure(amplifyConfig);
Analytics.disable();
Storage.configure({ level: 'public' });

const setupUser = async () => {
  const user = await Auth.currentAuthenticatedUser();
  console.log(user.attributes);
  // user is not assigned to organization yet
  // if (!user.attributes['custom:organizationId']) {
  //   return;
  // }

  console.log(user.signInUserSession.accessToken.payload['cognito:groups']);

  const items = [
    ['app:organizationId', user.attributes['custom:organizationId'] || 'N/A'],
    ['app:organizationName', user.attributes['custom:organizationName'] || 'N/A'],
    ['app:name', user.attributes['name']],
    ['app:email', user.attributes['email']],
    ['app:username', user.username],
    ['app:group', (user.signInUserSession.accessToken.payload['cognito:groups'].filter((x) => !x.includes('_'))[0] || 'N/A')],
  ];

  await AsyncStorage.multiSet(items);
};

const Stack = createStackNavigator();

function App({ authState, onStateChange }) {
  const [spinner, setSpinner] = useState(false);
  const [isReady, setIsReady] = useState(false);

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

  const appListener = ({ payload: { event, data } }) => {
    global.logger.debug('Hub: app', event);
    switch (event) {
    case 'loading':
      setSpinner(true);
      break;
    case 'loading-complete':
      setSpinner(false);
      break;
    }
  };

  useEffect(() => {
    (async () => {
      setIsReady(false);
      setSpinner(true);
      Hub.listen('auth', authListener);
      Hub.listen('app', appListener);
      await Promise.all([
        setupUser(),
      ]);
      setIsReady(true);
      setSpinner(false);
    })();

    return () => {
      console.log('unmount app.js');
      Hub.remove('auth', authListener);
      Hub.remove('app', appListener);
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
          {isReady &&
            <NavigationContainer linking={LinkingConfiguration}>
              <Stack.Navigator>
                <Stack.Screen name="Root" component={BottomTabNavigator} />
                <Stack.Screen name="User" component={UserScreen} />
              </Stack.Navigator>
            </NavigationContainer>}
          <Loading
            active={spinner}
          />
        </View>
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.primary,
  },
});

export default withAuthenticator(App, authenticatorConfig, undefined, undefined, amplifyTheme);

// export default (props) => {
//   const AppComponent = withAuthenticator(App, authenticatorConfig, undefined, undefined, amplifyTheme);
//   return <AppComponent {...props} />;
// };
