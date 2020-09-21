import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import OrganizationTaskTable from 'components/OrganizationTaskTable';

const useStyles = makeStyles((theme) => ({
  content: {
    flex: 1,
    // padding: theme.spacing(2),
  },
}));

export default function Tasks() {
  const classes = useStyles();

  const id = localStorage.getItem('app:organizationId');

  return (
    <div className={classes.content}>
      <OrganizationTaskTable organizationId={id} />
    </div>
  );
}
