import React from 'react';
import { Badge } from 'react-native-elements';
import { StyleSheet } from 'react-native';

export default function BadgeInactive() {
  return (
    <Badge
      {...{
        value: '停用中',
        textStyle: styles.badgeTextInactive,
        badgeStyle: styles.badgeInactive,
      }}
    />
  );
}

const styles = StyleSheet.create({
  badgeTextInactive: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 16,
  },
  badgeInactive: {
    height: 25,
    padding: 5,
    backgroundColor: '#767577',
  },
});
