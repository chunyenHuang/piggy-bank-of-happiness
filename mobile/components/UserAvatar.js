import React, { useEffect, useState } from 'react';
import { Avatar, Accessory } from 'react-native-elements';
import { Storage } from 'aws-amplify';

import Colors from 'constants/Colors';
import Loading from 'components/Loading';
import { selectAndUpload } from 'src/utils/image';

export default function UserAvatar({ username, name = '', size = 'medium', editable = false }) {
  const [avatarUri, setAvatarUri] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [s3Key, setS3Key] = useState();

  const selectImage = async () => {
    try {
      setIsLoading(true);

      const options = {
        aspect: [1, 1],
        quality: 0,
        resize: { width: 80, height: 80 },
      };
      await selectAndUpload(s3Key, options);

      setAvatarUri(await Storage.get(s3Key));
    } catch (err) {
      global.logger.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      setAvatarUri(await Storage.get(s3Key));
    })();
  }, [s3Key]);

  useEffect(() => {
    setS3Key(`users/${username}/avatar.jpeg`);
  }, [username]);

  return (
    <Avatar
      title={(name || '').substring(0, 1)}
      size={size}
      rounded
      overlayContainerStyle={{ backgroundColor: Colors.light }}
      source={{ uri: avatarUri }}
      onPress={selectImage}
    >
      {editable &&
      <Accessory
        onPress={selectImage}
        size={23}
      />}
      <Loading active={isLoading} mode="contained"/>
    </Avatar>
  );
}
