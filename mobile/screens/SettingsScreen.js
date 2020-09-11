import React, { useState, useEffect } from 'react';
import { View, StyleSheet, AsyncStorage } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { ListItem } from 'react-native-elements';

import SignOutButton from 'components/auth/SignOutButton';
import Version from 'components/Version';
import routes from 'navigation/routes';

export default function SettingsScreen() {
  const navigation = useNavigation();

  const [menu, setMenu] = useState([]);

  useEffect(() => {
    (async () => {
      const userGroup = await AsyncStorage.getItem('app:group');
      const menu = routes
        .filter(({ type, showInSettingsMenu }) => type === 'stack' && showInSettingsMenu)
        .filter(({ groups }) => groups.includes(userGroup) || groups.includes('All'))
        .map((route) => {
          return {
            title: route.title,
            onPress() {
              navigation.navigate('Stacks', { screen: route.name, params: {} });
            },
          };
        });

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
