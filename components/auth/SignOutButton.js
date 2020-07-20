import React from 'react';
import { Button } from 'react-native-paper';
import { Auth, Hub } from 'aws-amplify';
import { AsyncStorage } from 'react-native';

import Colors from '../../constants/Colors';

export default function SignOutButton() {
  const signOut = async () => {
    Hub.dispatch('app', { event: 'loading' });

    const keys = (await AsyncStorage.getAllKeys()).filter((x) => x.startsWith('app:'));
    await AsyncStorage.multiRemove(keys);

    await Auth.signOut();
    Hub.dispatch('app', { event: 'loading-complete' });
  };

  return (
    <Button
      color={Colors.error}
      onPress={() => signOut()}
    >
      登出
    </Button>
  );
}
