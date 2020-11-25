import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import DetailForm from 'react-material-final-form';
import { v1 as uuidv1 } from 'uuid';

import formMetadata from 'forms/Organization';

const useStyles = makeStyles((theme) => ({
  content: {
    flex: 1,
    padding: theme.spacing(4),
    // height: `calc(100vh - 64px)`,
  },
  titleButton: {
    fontSize: 16,
    marginTop: theme.spacing(2),
  },
}));

const hideFields = ['id', 'isActive', 'status', 'username'];

const filteredFormMetadata = { fields: formMetadata.fields.filter(({ key }) => !hideFields.includes(key)) };

const cacheKey = 'app:org_application_form';

export default function OrgApplication() {
  const classes = useStyles();
  const [organizationId, setOrganizationId] = useState();
  const [username, setUsername] = useState();
  const [defaultData, setDefaultData] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const onCompleteForm = async (data) => {
    console.log(data);
    Object.assign(data, {
      id: data.id || uuidv1(),
      username,
    });
    localStorage.setItem(cacheKey, JSON.stringify(data));

    // go to upload file
  };

  useEffect(() => {
    const cache = localStorage.getItem(cacheKey);
    if (cache) {
      setDefaultData(JSON.parse(cache));
    }

    setUsername(localStorage.getItem('app:username'));
    setOrganizationId(localStorage.getItem('app:organizationId'));
  }, []);

  if (!username) {
    return (
      <Container maxWidth="sm" className={classes.content}>
        <Typography component="h1" variant="h4" align="center">
          申請加入幸福存摺
        </Typography>
        <Button
          color="inherit"
          component={Link}
          to={'/app?state=signup&redirect=/application'}
          className={classes.titleButton}
          fullWidth
        >
          還沒有帳號，請先點此註冊
        </Button>
        <Button
          color="inherit"
          component={Link}
          to={'/app?state=signin&redirect=/application'}
          className={classes.titleButton}
          fullWidth
        >
          已經有帳號，請點此登入
        </Button>
      </Container>);
  }

  // 使用者已經有 custom:organizationId
  if (organizationId) {
    return (
      <Container maxWidth="sm" className={classes.content}>
        <Typography component="h1" variant="h5" align="center">
          我們已經收到您的申請，請靜待審核。
        </Typography>
      </Container>);
  }

  return (
    <Container maxWidth="sm" className={classes.content}>
      <DetailForm
        title="申請加入幸福存摺"
        metadata={filteredFormMetadata}
        usePristine={false}
        submitButtonText={'申請'}
        data={defaultData}
        submitButtonProps={{
          variant: 'contained',
          color: 'primary',
          type: 'submit',
          fullWidth: false,
        }}
        isLoading={isLoading}
        onSubmit={onCompleteForm}
      />
    </Container>
  );
}
