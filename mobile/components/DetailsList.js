import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

import Colors from '../constants/Colors';

export default function DetailsList({ data = {} }) {
  return (
    <View>
      {Object.keys(data).map((key)=>(
        <View key={key}>
          <Text style={styles.header}>
            {key}
          </Text>
          <Text style={styles.text}>
            {data[key]}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    color: Colors.light,
    padding: 8,
    paddingLeft: 16,
  },
  text: {
    color: Colors.dark,
    padding: 8,
    paddingRight: 16,
    textAlign: 'right',
  },
});
