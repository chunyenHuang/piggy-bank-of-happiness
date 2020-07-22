import React, { useEffect, useState } from 'react';
import { StyleSheet, AsyncStorage, View } from 'react-native';

import DetailsList from 'components/DetailsList';

export default function Profile() {
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
    <View style={styles.container}>
      <DetailsList data={data} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
});
