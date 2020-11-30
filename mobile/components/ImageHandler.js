import React, { useEffect, useState } from 'react';
import { Dimensions, Vibration, View, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { Camera } from 'expo-camera';
import { Icon } from 'react-native-elements';
import { select } from 'src/utils/image';
import { getHeaderProps } from 'src/utils/device';

const deviceWidth = Dimensions.get('window').width;

const size = 30;
const color = '#fff';

export default function ImageHandler({
  visible,
  aspect = [4, 3], // [4,3] [1,1]
  quality = 1,
  onUpdate,
  onClose,
}) {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [camera, setCamera] = useState();
  const [isBusy, setIsBusy] = useState(false);

  const selectFromCameraRoll = async () => {
    const options = {
      aspect,
      quality,
      allowsEditing: aspect[0] === aspect[1],
    };
    const image = await select(options);

    setIsBusy(true);

    onUpdate(image);

    setTimeout(() => {
      setIsBusy(false);
    }, 1000);
  };

  const takePicture = async () => {
    setIsBusy(true);
    Vibration.vibrate();

    const options = {
      quality,
      exif: false,
    };
    const image = await camera.takePictureAsync(options);

    onUpdate(image);

    setTimeout(() => {
      setIsBusy(false);
    }, 1000);
  };

  const flip = () => {
    const newType = type === Camera.Constants.Type.back ?
      Camera.Constants.Type.front : Camera.Constants.Type.back;
    setType(newType);
  };

  useEffect(() => {
    (async () => {
      if (visible) {
        const { status } = await Camera.requestPermissionsAsync();
        if (status !== 'granted') {
          return onClose();
        }
      }

      setIsBusy(!visible);
    })();
  }, [visible]);

  // useEffect(() => {
  //   (async () => {
  //     if (camera) {
  //       const sizes = await camera.getAvailablePictureSizesAsync();
  //       console.log(sizes);
  //     }
  //   })();
  // }, [camera]);

  return (
    <Modal
      isVisible={visible}
      style={styles.modal}
      hardwareAccelerated
    >
      <View
        style={styles.container}
      >
        <View style={styles.topContainer}>
          <Icon
            name="md-close"
            size={size}
            type='ionicon'
            color={color}
            onPress={onClose}
          />
        </View>
        <Camera
          style={{
            width: deviceWidth,
            height: deviceWidth * aspect[0] / aspect[1],
          }}
          ref={(ref) => setCamera(ref)}
          type={type}
          autoFocus={Camera.Constants.AutoFocus.on}
        />
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.icon}
            disabled={isBusy}
            onPress={selectFromCameraRoll}
          >
            <Icon
              name={'images'}
              type='font-awesome-5'
              color={color}
              size={size}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.icon}
            disabled={isBusy}
            onPress={takePicture}
          >
            <Icon
              name={'camera'}
              type='font-awesome-5'
              color={color}
              size={size}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.icon}
            disabled={isBusy}
            onPress={flip}
          >
            <Icon
              name={'sync-alt'}
              type='font-awesome-5'
              color={color}
              size={size}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  topContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: '#000',
    paddingRight: 20,
    paddingBottom: 10,
    paddingTop: getHeaderProps().paddingTop,
  },
  camera: {},
  bottomContainer: {
    flex: 1,
    width: deviceWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#000',
    padding: 20,
  },
  icon: {},
});
