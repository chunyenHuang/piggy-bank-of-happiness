import React from 'react';
import { Button } from 'react-native-paper';
import { Auth } from 'aws-amplify';

import Colors from '../../constants/Colors';

export default function SignOutButton() {
  return (
    <Button
      color={Colors.error}
      onPress={() => Auth.signOut()}
    >
      登出
    </Button>
  );
}
