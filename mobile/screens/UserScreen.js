import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import User from 'components/User';

export default function UserScreen({ route }) {
  return (
    <View style={styles.container}>
      <User user={route.params}/>
    </View>
  );
}

User.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
