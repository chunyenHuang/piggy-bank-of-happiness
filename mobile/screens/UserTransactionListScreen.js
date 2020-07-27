import React, { useEffect, useState } from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';

import User from '../components/User';

export default function UserTransactionListScreen() {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    (async () => {
      const data = {
        organizationId: await AsyncStorage.getItem('app:organizationId'),
        username: await AsyncStorage.getItem('app:username'),
        name: await AsyncStorage.getItem('app:name'),
      };
      console.log('data', data);
      setUser(data);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {user && <User user={user} mode="view"/>}
    </View>
  );
}

UserTransactionListScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 8,
  },
  contentContainer: {
    // padding: 8,
    // paddingTop: 30,
  },
});
