import React from 'react';
import { StyleSheet, View, ActivityIndicator, Dimensions } from 'react-native';

import Colors from '../constants/Colors';

export default function Loading({ active = false, mode = 'fullscreen', color = Colors.primary }) {
  if (!active) return null;

  if (mode === 'fullscreen') {
    return (
      <View
        style={styles.fullscreenContainer}
        alignItems="center"
        justifyContent="center"
      >
        <ActivityIndicator
          style={styles.fullscreen}
          color={color}
          size={'large'}
          animating={true}
        />
      </View>);
  }
  return (
    <View
      style={styles.default}
      alignItems="center"
      justifyContent="center"
    >
      <ActivityIndicator
        color={color}
        size={'small'}
        animating={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  default: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    opacity: 0.3,
    zIndex: 9999999,
  },
  fullscreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#fff',
    opacity: 0.5,
    zIndex: 9999999,
  },
});
