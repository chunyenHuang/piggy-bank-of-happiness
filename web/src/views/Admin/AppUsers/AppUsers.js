import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import CognitoUsersTable from 'components/CognitoUsersTable';

const useStyles = makeStyles((theme) => ({
  content: {
    flex: 1,
    // padding: theme.spacing(2),
  },
}));

export default function AppUsers() {
  const classes = useStyles();

  return (
    <div className={classes.content}>
      <CognitoUsersTable />
    </div>
  );
}
