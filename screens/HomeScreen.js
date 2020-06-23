import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: 'https://g0v.hackmd.io/hYxXZzK0TW6S6cD2mpSWdQ' }} />
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
