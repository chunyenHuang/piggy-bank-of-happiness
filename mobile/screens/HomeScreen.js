import React, { useEffect, useState } from 'react';
import { AsyncStorage } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Hub } from 'aws-amplify';

export default function HomeScreen() {
  const [uri, setUri] = useState('');

  useEffect(() => {
    (async () => {
      Hub.dispatch('app', { event: 'loading' });

      const organizationId = await AsyncStorage.getItem('app:organizationId');
      const url = organizationId !== 'N/A' ?
        'https://g0v.hackmd.io/hYxXZzK0TW6S6cD2mpSWdQ' :
        'https://g0v.hackmd.io/92ynyG5gSVSpAGNq0xx1mg?view#APP-Home';
      setUri(url);

      Hub.dispatch('app', { event: 'loading-complete' });
    })();
  }, []);
  return (
    <View style={styles.container}>
      {uri !== '' && <WebView source={{ uri }} />}
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
