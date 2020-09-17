import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Storage } from 'aws-amplify';

import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  avatar: {
    border: '1px solid rgba(255,255,255,0.3)',
  },
}));

export default function RewardAvatar({ organizationId, id }) {
  const classes = useStyles();

  const [uri, setUri] = useState();
  const [s3Key, setS3Key] = useState();

  useEffect(() => {
    (async () => {
      setUri(await Storage.get(s3Key));
    })();
  }, [s3Key]);

  useEffect(() => {
    setS3Key(`organizations/${organizationId}/rewards/${id}/avatar.jpeg`);
  }, [organizationId, id]);

  return (
    <Avatar
      alt={'獎  '}
      src={uri}
      variant="square"
      className={classes.avatar}
    />
  );
}

RewardAvatar.propTypes = {
  organizationId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};
