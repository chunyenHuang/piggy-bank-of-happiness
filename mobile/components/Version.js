import React from 'react';
import { Platform, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as Updates from 'expo-updates';

import amplifyConfig from '../amplify.config';
import appConfig from '../app.json';
import Colors from 'constants/Colors';

export default function Version() {
  const version = appConfig.expo.version;
  const buildNumber = Platform.OS === 'ios' ? appConfig.expo.ios.buildNumber :
    Platform.OS === 'android' ? appConfig.expo.android.versionCode : '';
  const envName = amplifyConfig.env;

  const isPrd = envName === 'prd';

  const env = isPrd ? '' : envName;
  Platform.OS === 'ios';
  const build = isPrd ? '' : buildNumber;

  const checkUpdates = async () => {
    const { isAvailable } = await Updates.checkForUpdateAsync();
    if (isAvailable) {
      await Updates.fetchUpdateAsync();
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={checkUpdates}
    >
      <Text style={styles.text}>
        {env.toUpperCase()} v{version} {build ? `(${build})` : ''}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  text: {
    textAlign: 'center',
    color: Colors.light,
  },
});
