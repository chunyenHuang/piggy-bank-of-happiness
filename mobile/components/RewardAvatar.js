import React, { useEffect, useState } from 'react';
import { Avatar, Accessory } from 'react-native-elements';
import { Storage } from 'aws-amplify';

import Colors from 'constants/Colors';
import Loading from 'components/Loading';
import { selectAndUpload, getAccessorySize } from 'src/utils/image';

export default function RewardAvatar({ organizationId, id, name = '', size = 'large', editable = false }) {
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
    setS3Key(`organizations/${organizationId}/rewards/${id}/avatar.jpeg`);
  }, [organizationId, id]);

  return (
    <Avatar
      title={(name || '').substring(0, 1)}
      size={size}
      // rounded
      overlayContainerStyle={{ backgroundColor: Colors.light }}
      icon={{ name: 'barcode', type: 'font-awesome' }}
      source={{ uri: avatarUri }}
      onPress={editable ? selectImage : undefined }
    >
      {editable &&
      <Accessory
        onPress={selectImage}
        size={getAccessorySize(size)}
      />}
      <Loading active={isLoading} mode="contained" />
    </Avatar>
  );
}
