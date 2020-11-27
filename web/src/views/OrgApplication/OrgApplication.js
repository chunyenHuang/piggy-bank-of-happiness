import React, { useEffect, useState, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';
import { toastr } from 'react-redux-toastr';

import { Auth } from 'aws-amplify';
import DetailForm from 'react-material-final-form';
import { v1 as uuidv1 } from 'uuid';
import { useDropzone } from 'react-dropzone';
import prettyBytes from 'pretty-bytes';

import { getOrganization } from 'graphql/queries';
import { createOrganizationApplication } from 'graphql/mutations';
import { request } from 'utilities/graph';

import formMetadata from 'forms/Organization';
import { upload } from 'utilities/file';

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
  dropZone: {
    padding: theme.spacing(2),
    border: '1px dashed rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    cursor: 'pointer',
    textAlign: 'center',
  },
}));

const hideFields = ['id', 'isActive', 'status', 'username'];

const filteredFormMetadata = { fields: formMetadata.fields.filter(({ key }) => !hideFields.includes(key)) };

const cacheKey = 'app:org_application_form';

export default function OrgApplication() {
  const classes = useStyles();
  const [organizationId, setOrganizationId] = useState();
  const [username, setUsername] = useState();
  const [toUploadFiles, setToUploadFiles] = useState([]);
  const [organization, setOrganization] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(Date.now());

  const [message, setMessage] = useState();

  const onDrop = useCallback((acceptedFiles) => {
    console.log(acceptedFiles);
    setToUploadFiles(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: [
      '.doc', '.docx',
      'application/msword',
      'image/*',
      '.pdf',
    ],
  });

  const onCompleteForm = async (data) => {
    if (toUploadFiles.length === 0) {
      toastr.error('請上傳機構證明文件');
      return;
    }

    setIsLoading(true);

    console.log(data);

    Object.assign(data, {
      id: organizationId,
      username,
    });
    localStorage.setItem(cacheKey, JSON.stringify(data));

    await Promise.all([
      request(createOrganizationApplication, { input: data }),
      ...toUploadFiles.map(async (file) => {
        const s3Key = `organizations/${organizationId}/documents/${file.name}`;
        await upload(s3Key, file, file.type);
      }),
    ]);

    setIsLoading(false);
    setLastUpdatedAt(Date.now());
  };

  useEffect(() => {
    setUsername(localStorage.getItem('app:username'));

    (async () => {
      const organizationId = localStorage.getItem('app:organizationId');
      if (organizationId && organizationId !== '') {
        const { data: { getOrganization: organization } } = await request(getOrganization, { id: organizationId });

        if (organization) {
          setOrganizationId(organizationId);
          setOrganization(organization);

          let message;
          switch (organization.status) {
          case 'Pending':
            message = '我們已經收到您的申請，請靜待審核結果。';
            break;
          case 'WaitingForAdditionalDocuments':
            message = '您的申請資料需要補充文件，請聯繫系統管理員。';
            break;
          case 'Approved':
            message = organization.isActive === 1 ? '' : '您的機構已被停止使用，請聯繫系統管理員。';
            break;
          case 'Rejected':
            message = '很抱歉您的申請已被拒絕，請聯繫系統管理員。';
            break;
          }
          setMessage(message);

          return;
        }
      }

      const cache = localStorage.getItem(cacheKey);
      if (cache) {
        setOrganization(JSON.parse(cache));
      }

      const user = await Auth.currentAuthenticatedUser();
      const newOrganizationId = uuidv1();
      setOrganizationId(newOrganizationId);
      await Auth.updateUserAttributes(user, {
        'custom:organizationId': newOrganizationId,
        'custom:organizationName': '幸福存摺',
      });
    })();
  }, [lastUpdatedAt]);

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
          還沒有帳號，請點此註冊
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

  if (!organizationId) {
    return null;
  }

  // 使用者已經有 custom:organizationId
  if (message) {
    return (
      <Container maxWidth="sm" className={classes.content}>
        <Typography component="h1" variant="h5" align="center">
          {message}
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
        data={organization}
        submitButtonProps={{
          variant: 'contained',
          color: 'primary',
          type: 'submit',
          fullWidth: false,
        }}
        isLoading={isLoading}
        onSubmit={onCompleteForm}
      >

        <p>立案字號 / 法人立案字號 / 證明文件 *</p>
        <div {...getRootProps()}>
          <input {...getInputProps()} />
          <div className={classes.dropZone}>點擊選取 或 拖曳檔案至此</div>
        </div>
        <List className={classes.root}>
          {toUploadFiles.map((file, index)=>(
            <ListItem key={index}>
              <ListItemAvatar>
                {index+1}
              </ListItemAvatar>
              <ListItemText primary={file.name} secondary={prettyBytes(file.size)} />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete" onClick={()=>{
                  toUploadFiles.splice(index, 1);
                  setToUploadFiles([...toUploadFiles]);
                }}>
                  <ClearIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DetailForm>
    </Container>
  );
}
