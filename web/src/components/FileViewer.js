import React from 'react';
import PropTypes from 'prop-types';
import { Storage } from 'aws-amplify';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import GetAppIcon from '@material-ui/icons/GetApp';
import prettyBytes from 'pretty-bytes';
import moment from 'moment';

import { download } from 'utilities/file';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  listSubHeader: {
    fontWeight: 700,
    borderBottom: '1px solid #E5E5E5',
    cursor: 'pointer',
  },
}));

export default function FileViewer({ s3Prefix }) {
  const classes = useStyles();

  const [files, setFiles] = React.useState([]);
  const [isBusy, setIsBusy] = React.useState(false);

  React.useEffect(() => {
    if (!s3Prefix) return;

    (async () => {
      console.log(s3Prefix);
      const data = await Storage.list(s3Prefix, { level: 'public' });
      console.log(data);
      setFiles(data);
    })();
  }, [s3Prefix]);

  return (<Card className={classes.root}>
    <ListSubheader
      component="li"
      className={classes.listSubHeader}
      disableSticky={true}
    >
      文件資料
    </ListSubheader>
    <List className={classes.root}>
      {files.map((file, index)=>(
        <ListItem key={index}>
          <ListItemAvatar>
            {index+1}
          </ListItemAvatar>
          <ListItemText
            primary={file.key.replace(s3Prefix, '')}
            secondary={`${moment(file.lastModified).format('YYYY-MM-DD')} (${prettyBytes(file.size)})`}
          />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="download"
              disabled={isBusy}
              onClick={async ()=>{
                setIsBusy(true);
                await download(file.key, file.key.replace(s3Prefix, ''));
                setIsBusy(false);
              }}>
              <GetAppIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  </Card>);
}

FileViewer.propTypes = {
  s3Prefix: PropTypes.string,
};
