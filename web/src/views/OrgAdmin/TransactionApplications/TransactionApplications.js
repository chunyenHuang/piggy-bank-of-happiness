import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import OrganizationTransactionApplicationTable from 'components/OrganizationTransactionApplicationTable';

const useStyles = makeStyles((theme) => ({
  content: {
    flex: 1,
    // padding: theme.spacing(2),
  },
}));

export default function TransactionApplications() {
  const classes = useStyles();

  const id = localStorage.getItem('app:organizationId');

  return (
    <div className={classes.content}>
      <OrganizationTransactionApplicationTable organizationId={id} />
    </div>
  );
}
