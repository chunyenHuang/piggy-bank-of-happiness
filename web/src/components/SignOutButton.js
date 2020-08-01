import React from 'react';
import { useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import Button from '@material-ui/core/Button';

export default function SignOutButton() {
  const history = useHistory();

  const signOut = async () => {
    await Auth.signOut();
    history.push('/');
  };
  return (
    <Button onClick={signOut}>
      Sign Out
    </Button>
  );
}
