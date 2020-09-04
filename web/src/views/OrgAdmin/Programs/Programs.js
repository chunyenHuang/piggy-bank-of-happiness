import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import OrganizationProgramTable from 'components/OrganizationProgramTable';

const useStyles = makeStyles((theme) => ({
  content: {
    flex: 1,
    // padding: theme.spacing(2),
  },
}));

export default function Programs() {
  const classes = useStyles();

  const id = localStorage.getItem('app:organizationId');

  return (
    <div className={classes.content}>
      <OrganizationProgramTable organizationId={id} />
    </div>
  );
}
