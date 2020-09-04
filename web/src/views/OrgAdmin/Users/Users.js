import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import OrganizationUserTable from 'components/OrganizationUserTable';

const useStyles = makeStyles((theme) => ({
  content: {
    flex: 1,
    // padding: theme.spacing(2),
  },
}));

export default function Users() {
  const classes = useStyles();

  const id = localStorage.getItem('app:organizationId');

  return (
    <div className={classes.content}>
      <OrganizationUserTable organizationId={id} />
    </div>
  );
}
