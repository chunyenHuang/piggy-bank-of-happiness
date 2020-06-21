import React from 'react';
import { Button } from 'react-native-paper';
import { Auth } from 'aws-amplify';

export default function SignOutButton() {
  return (
    <Button
      mode="outlined"
      color="red"
      onPress={() => Auth.signOut()}
      type="outline">
      登出
    </Button>
  );
}
