import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Storage } from 'aws-amplify';

import Avatar from '@material-ui/core/Avatar';

export default function UserAvatar({ username }) {
  const [uri, setUri] = useState();
  const [s3Key, setS3Key] = useState();

  useEffect(() => {
    (async () => {
      setUri(await Storage.get(s3Key));
    })();
  }, [s3Key]);

  useEffect(() => {
    setS3Key(`users/${username}/avatar.jpeg`);
  }, [username]);

  return (
    <Avatar alt={''} src={uri} />
  );
}

UserAvatar.propTypes = {
  username: PropTypes.string.isRequired,
};
