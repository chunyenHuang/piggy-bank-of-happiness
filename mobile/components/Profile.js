import React, { useEffect, useState } from 'react';
import { StyleSheet, AsyncStorage, View } from 'react-native';

import DetailsList from 'components/DetailsList';
import { getGroupDisplayName } from 'src/admin/utils';
import UserAvatar from 'components/UserAvatar';

export default function Profile() {
  const [data, setData] = useState({});
  const [username, setUsername] = useState();

  useEffect(() => {
    (async () => {
      const data = {
        機構: await AsyncStorage.getItem('app:organizationName'),
        姓名: await AsyncStorage.getItem('app:name'),
        // 帳號: await AsyncStorage.getItem('app:username'),
        電子信箱: await AsyncStorage.getItem('app:email'),
        權限: getGroupDisplayName(await AsyncStorage.getItem('app:group')),
      };
      setData(data);

      setUsername(await AsyncStorage.getItem('app:username'));
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <UserAvatar
          username={username}
          name={`${(data['姓名'] || '')}`}
          editable={true}
          size="large"
        />
      </View>

      <DetailsList data={data} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  avatarContainer: {
    alignItems: 'center',
    padding: 16,
  },
});
