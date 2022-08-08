import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, StatusBar, StyleSheet, View, Clipboard } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from 'react-native-elements';
import { MenuProvider } from 'react-native-popup-menu';
// amplify
import Amplify, { Hub, Storage } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';
import Analytics from '@aws-amplify/analytics';
// expo
import * as Updates from 'expo-updates';

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
import elementsTheme from 'constants/Elements.theme';
import Loading from 'components/Loading';
import UserSetup from 'components/UserSetup';

Amplify.configure(amplifyConfig);
Analytics.disable();
Storage.configure({ level: 'public' });

const Stack = createStackNavigator();

// https://github.com/expo/expo/issues/9089
// HACK: Prevent "Expo pasted from CoreSimulator" notification from spamming continuously
if (__DEV__) {
  Clipboard.setString('');
}

function App({ authState, onStateChange }) {
  const [spinner, setSpinner] = useState(false);
  const [isUserSetup, setIsUserSetup] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const authListener = ({ payload: { event, data } }) => {
    switch (event) {
    case 'signIn':
      // setupUser();
      break;
    case 'signIn_failure':
      global.logger.warn(data);
      break;
    case 'signOut':
      // setUser(null);
      if (onStateChange) onStateChange('signedOut');
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

    const expoUpdatesListener = Updates.addListener((updateEvent) => {
      console.log('expo-update-event', updateEvent);
      const { type, manifest } = updateEvent;
      if (type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
        Alert.alert(
          `偵測到新版本`,
          `${manifest.version || ''}`,
          [
            {
              text: '馬上體驗',
              onPress: async () => {
                await Updates.reloadAsync();
              },
            },
          ], { cancelable: false },
        );
      }
    });

    return () => {
      Hub.remove('auth', authListener);
      Hub.remove('app', appListener);
      expoUpdatesListener.remove();
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
      <ThemeProvider theme={elementsTheme}>
        <MenuProvider customStyles={{ backdrop: styles.popupMenuBackdrop }}>
          <View style={styles.container}>
            {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
            {/* <NavigationContainer linking={LinkingConfiguration}> */}
            {isReady &&
              <NavigationContainer>
                <Stack.Navigator>
                  <Stack.Screen name="Root" component={BottomTabNavigator} />
                  <Stack.Screen name="Stacks" component={StackNavigator} hea/>
                </Stack.Navigator>
              </NavigationContainer>}
            <Loading
              active={spinner}
            />
          </View>
        </MenuProvider>
      </ThemeProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  popupMenuBackdrop: {
    backgroundColor: '#000',
    opacity: 0.35,
  },
});

export default withAuthenticator(App, authenticatorConfig, undefined, undefined, amplifyTheme);
