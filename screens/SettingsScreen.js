import React, { useEffect, useState } from 'react';
import { View, StyleSheet, AsyncStorage } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text } from 'react-native-elements';

import SignOutButton from '../components/auth/SignOutButton';
import Colors from '../constants/Colors';

export default function SettingsScreen() {
  const [data, setData] = useState({});
  useEffect(() => {
    (async () => {
      const data = {
        機構: await AsyncStorage.getItem('app:organizationName'),
        姓名: await AsyncStorage.getItem('app:name'),
        // 帳號: await AsyncStorage.getItem('app:username'),
        電子信箱: await AsyncStorage.getItem('app:email'),
        權限: await AsyncStorage.getItem('app:group'),
      };
      setData(data);
    })();
  }, []);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
      <View style={{ height: 32 }}></View>
      <SignOutButton />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    padding: 8,
  },
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
