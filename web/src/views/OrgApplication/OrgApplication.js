import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import DetailForm from 'react-material-final-form';

import formMetadata from 'forms/ApplicationOrganization';

const useStyles = makeStyles((theme) => ({
  content: {
    flex: 1,
    padding: theme.spacing(4),
    // height: `calc(100vh - 64px)`,
  },
}));

export default function OrgApplication() {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);

  const onCreate = async () => {

  };

  return (
    <Container maxWidth="sm" className={classes.content}>
      即將開放
      {/* <DetailForm
        title="申請加入幸福存摺"
        metadata={formMetadata}
        usePristine={true}
        submitButtonText={'申請'}
        submitButtonProps={{
          variant: 'contained',
          color: 'primary',
          type: 'submit',
          fullWidth: false,
        }}
        isLoading={isLoading}
        onSubmit={onCreate}
      /> */}
    </Container>
  );
}
