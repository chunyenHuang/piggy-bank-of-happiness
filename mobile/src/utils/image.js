import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as ImageManipulator from 'expo-image-manipulator';
import { Storage } from 'aws-amplify';

export const selectAndUpload = async (s3Key, options = {}) => {
  const uri = await select(options);

  if (uri) {
    await upload(uri, s3Key, options);
  }
};

export const select = async (options = {}) => {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  if (status !== 'granted') {
    return;
  }

  const { allowsEditing, aspect, quality } = options;

  const launchParams = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing,
    aspect,
    quality,
    exif: false,
  };

  const { cancelled, uri, width, height } = await ImagePicker.launchImageLibraryAsync(launchParams);

  if (cancelled) {
    return;
  }

  return { uri, width, height };
};

export const upload = async (uri, s3Key, options = {}) => {
  const {
    resize,
  } = options;

  const isPng = s3Key.endsWith('png') ? true : false;
  const format = isPng ? ImageManipulator.SaveFormat.PNG : ImageManipulator.SaveFormat.JPEG;
  const contentType = isPng ? 'image/png' : 'image/jpeg';

  let updatedUri = uri;
  if (resize) {
    const actions = [{ resize }];
    const saveOptions = {
      compress: 1,
      format,
    };
    const res = await ImageManipulator.manipulateAsync(uri, actions, saveOptions);
    updatedUri = res.uri;
  }


  const response = await fetch(updatedUri);
  const blob = await response.blob();

  await Storage.put(s3Key, blob, { contentType });
};

export const getAccessorySize = (inImageSize) => {
  switch (inImageSize) {
  case 'medium':
    return 15;
  case 'large':
    return 23;
  default:
    return 10;
  }
};

export const getResizeProps = (width, height, target) => {
  const isPortrait = width < height;
  const ratio = isPortrait ? height / width : width / height;

  if (isPortrait) {
    return {
      width: target,
      height: target * ratio,
    };
  } else {
    return {
      width: target * ratio,
      height: target,
    };
  }
};
