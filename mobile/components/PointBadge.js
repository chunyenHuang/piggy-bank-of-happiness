import React from 'react';
import { Badge } from 'react-native-elements';
import { StyleSheet } from 'react-native';

import { currency } from '../src/utils/format';

export default function PointBadge({ value }) {
  const status = value >= 0 ? 'primary' : 'error';
  return (
    <Badge
      status={status}
      value={currency(value, false)}
      textStyle={styles.textStyle}
      badgeStyle={styles.badgeStyle}/>
  );
}

const styles = StyleSheet.create({
  badgeStyle: {
    height: 40,
    margin: 5,
    paddingLeft: 8,
    paddingRight: 8,
  },
  textStyle: {
    fontSize: 30,
  },
});
