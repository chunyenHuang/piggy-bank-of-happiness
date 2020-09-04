import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import OrganizationTransactionTable from 'components/OrganizationTransactionTable';

const useStyles = makeStyles((theme) => ({
  content: {
    flex: 1,
    // padding: theme.spacing(2),
  },
}));

export default function Transactions() {
  const classes = useStyles();

  const id = localStorage.getItem('app:organizationId');

  return (
    <div className={classes.content}>
      <OrganizationTransactionTable organizationId={id} />
    </div>
  );
}
