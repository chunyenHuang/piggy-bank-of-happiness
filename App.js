import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
// amplify
import Amplify, { Hub, Storage } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';
import Analytics from '@aws-amplify/analytics';

import './global';
import useCachedResources from './hooks/useCachedResources';
import BottomTabNavigator from 'navigation/BottomTabNavigator';
import LinkingConfiguration from 'navigation/LinkingConfiguration';
import StackNavigator from 'navigation/StackNavigator';
// import Colors from './constants/Colors';
import authenticatorConfig from './authenticator.config';
import amplifyConfig from './amplify.config';

import amplifyTheme from 'constants/Amplify.theme';
import paperTheme from 'constants/Paper.theme';
import Loading from 'components/Loading';
import UserSetup from 'components/UserSetup';


Amplify.configure(amplifyConfig);
Analytics.disable();
Storage.configure({ level: 'public' });

const Stack = createStackNavigator();

function App({ authState, onStateChange }) {
  const [spinner, setSpinner] = useState(false);
  const [isUserSetup, setIsUserSetup] = useState(false);
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
    case 'loading':
      return <Loading active={true} />;
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
    setIsReady(false);
    setSpinner(true);
    Hub.listen('auth', authListener);
    Hub.listen('app', appListener);
    setIsReady(true);
    setSpinner(false);

    return () => {
      console.log('unmount app.js');
      Hub.remove('auth', authListener);
      Hub.remove('app', appListener);
    };
  }, []);

  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return (
      <Loading
        active={true}
      />);
  }

  if (!isUserSetup) {
    return (<UserSetup onComplete={() => setIsUserSetup(true)} />);
  }

  return (
    <PaperProvider theme={paperTheme}>
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
        {isReady &&
          <NavigationContainer linking={LinkingConfiguration}>
            <Stack.Navigator>
              <Stack.Screen name="Root" component={BottomTabNavigator} />
              <Stack.Screen name="Stacks" component={StackNavigator} hea/>
            </Stack.Navigator>
          </NavigationContainer>}
        <Loading
          active={spinner}
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default withAuthenticator(App, authenticatorConfig, undefined, undefined, amplifyTheme);
