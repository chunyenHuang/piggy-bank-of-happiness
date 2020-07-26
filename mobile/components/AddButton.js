import React from 'react';
import { Icon } from 'react-native-elements';
import { StyleSheet } from 'react-native';

export default function AddButton({ onPress }) {
  return (
    <Icon
      name={'md-add'}
      type='ionicon'
      color='#fff'
      containerStyle={styles.iconContainer}
      onPress={() => onPress && onPress()}
    />
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    paddingRight: 10,
  },
});
