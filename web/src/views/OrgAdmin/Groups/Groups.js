import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import OrganizationGroupTable from 'components/OrganizationGroupTable';

const useStyles = makeStyles((theme) => ({
  content: {
    flex: 1,
    // padding: theme.spacing(2),
  },
}));

export default function Groups() {
  const classes = useStyles();

  const id = localStorage.getItem('app:organizationId');

  return (
    <div className={classes.content}>
      <OrganizationGroupTable organizationId={id} />
    </div>
  );
}
