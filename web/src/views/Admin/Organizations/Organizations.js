import React from 'react';

import { makeStyles } from '@material-ui/core/styles';

import OrganizationTable from 'components/OrganizationTable';

const useStyles = makeStyles((theme) => ({
  content: {
    flex: 1,
    // padding: theme.spacing(2),
  },
}));

export default function Organizations() {
  const classes = useStyles();

  return (
    <div className={classes.content}>
      <OrganizationTable />
    </div>
  );
}
