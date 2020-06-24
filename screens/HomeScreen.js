import React, { useEffect, useState } from 'react';
import { AsyncStorage } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function HomeScreen() {
  const [uri, setUri] = useState('');

  useEffect(() => {
    (async () => {
      const organizationId = await AsyncStorage.getItem('app:organizationId');
      const url = organizationId !== 'N/A' ?
        'https://g0v.hackmd.io/hYxXZzK0TW6S6cD2mpSWdQ' :
        'https://g0v.hackmd.io/92ynyG5gSVSpAGNq0xx1mg?view#APP-Home';
      setUri(url);
    })();
  }, []);
  return (
    <View style={styles.container}>
      <WebView source={{ uri }} />
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
});
