import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';

import amplifyConfig from '../amplify.config';
import appConfig from '../app.json';
import Colors from 'constants/Colors';

export default function Version() {
  const version = appConfig.expo.version;
  const buildNumber = Platform.OS === 'ios' ? appConfig.expo.ios.buildNumber :
    Platform.OS === 'android' ? appConfig.expo.android.versionCode : '';
  const envName = amplifyConfig.aws_cloud_logic_custom[0].endpoint.split('/').pop();

  const isPrd = envName === 'prd';

  const env = isPrd ? '' : envName;
  Platform.OS === 'ios'
  const build = isPrd ? '' : buildNumber;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {env.toUpperCase()} v{version} {build ? `(${build})` : ''}
      </Text>
    </View>
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
