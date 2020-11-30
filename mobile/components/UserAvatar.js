import React, { useEffect, useState } from 'react';
import { Avatar, Accessory } from 'react-native-elements';
import { Storage } from 'aws-amplify';

import Colors from 'constants/Colors';
import Loading from 'components/Loading';
import ImageHandler from 'components/ImageHandler';
import ImageViewer from 'components/ImageViewer';
import { upload, getAccessorySize, getResizeProps } from 'src/utils/image';

export default function UserAvatar({ username, name = '', size = 'medium', editable = false }) {
  const [avatarUri, setAvatarUri] = useState();
  const [imageUri, setImageUri] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [s3Key, setS3Key] = useState();
  const [s3KeyOriginalImage, setS3KeyOriginalImage] = useState();
  const [showEditor, setShowEditor] = useState(false);
  const [showViewer, setShowViewer] = useState(false);

  const handleView = () => {
    setShowViewer(true);
  };

  const handleModify = async () => {
    setShowEditor(true);
  };

  const handleImage = async ({ uri, width, height }) => {
    setShowEditor(false);
    try {
      setIsLoading(true);

      await Promise.all([
        // thumbnail
        upload(uri, s3Key, {
          resize: getResizeProps(width, height, 80),
        }),
        upload(uri, s3KeyOriginalImage, {
          resize: getResizeProps(width, height, 480),
        }),
      ]);

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
    (async () => {
      setImageUri(await Storage.get(s3KeyOriginalImage));
    })();
  }, [s3KeyOriginalImage]);

  useEffect(() => {
    const prefix = `users/${username}`;
    setS3Key(`${prefix}/avatar.jpeg`);
    setS3KeyOriginalImage(`${prefix}/image.jpeg`);
  }, [username]);

  return (
    <Avatar
      title={(name || '').substring(0, 1)}
      size={size}
      rounded
      overlayContainerStyle={{ backgroundColor: Colors.light }}
      source={{ uri: avatarUri }}
      onPress={handleView}
    >
      {editable &&
      <Accessory
        onPress={handleModify}
        size={getAccessorySize(size)}
      />}
      <Loading active={isLoading} mode="contained" />
      <ImageHandler
        visible={showEditor}
        selectOptions={{}}
        onClose={() => setShowEditor(false)}
        onUpdate={handleImage}
      />
      <ImageViewer
        visible={showViewer}
        title={name}
        uri={imageUri}
        onClose={() => setShowViewer(false)}
      />
    </Avatar>
  );
}
