import React, { useState, useEffect } from 'react';
import { View, StyleSheet, AsyncStorage } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { ListItem } from 'react-native-elements';

import SignOutButton from 'components/auth/SignOutButton';
import Profile from 'components/Profile';
import Version from 'components/Version';

export default function SettingsScreen() {
  const navigation = useNavigation();

  const [menu, setMenu] = useState([]);

  useEffect(() => {
    (async () => {
      const userGroup = await AsyncStorage.getItem('app:group');
      const menu = [
        {
          title: '註冊用戶列表',
          onPress: () => {
            navigation.navigate('Stacks', { screen: 'CognitoUserList', initial: false, params: {} });
          },
          groups: ['AppAdmins'],
        },
        {
          title: '任務類別',
          onPress: () => {
            navigation.navigate('Stacks', { screen: 'Programs', initial: false, params: {} });
          },
          groups: ['AppAdmins', 'OrgAdmins'],
        },
        {
          title: '學生分組',
          component: Profile,
          onPress: () => {
            navigation.navigate('Stacks', { screen: 'Groups', initial: false, params: {} });
          },
          groups: ['AppAdmins', 'OrgAdmins'],
        },
        {
          title: '個人資料',
          component: Profile,
          onPress: () => {
            navigation.navigate('Stacks', { screen: 'Profile', initial: false, params: {} });
          },
          groups: ['All'],
        },
      ].filter(({ groups }) => groups.includes(userGroup) || groups.includes('All'));

      if (menu.length >= 1) {
        menu[0].isExpanded = true;
      }

      setMenu(menu);
    })();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {menu.map(({ title, onPress })=>(
        <ListItem
          key={title}
          title={title}
          bottomDivider
          chevron
          onPress={onPress}
        />
      ))}
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
  contentContainer: {},
});
