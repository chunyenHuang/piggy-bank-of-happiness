import React, { useEffect, useState } from 'react';
import { View, StyleSheet, AsyncStorage } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import SignOutButton from '../components/auth/SignOutButton';
import DetailsList from '../components/DetailsList';
import Version from 'components/Version';

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
      <DetailsList data={data} />
      <View style={{ height: 32 }}></View>
      <SignOutButton />
      <Version />
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
});
