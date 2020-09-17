import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Image } from 'react-native-elements';

import CustomModal from './CustomModal';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

export default function ImageViewer({
  visible,
  title = '',
  uri: inUri,
  onClose,
}) {
  const [uri, setUri] = useState();

  useEffect(() => {
    if (inUri) {
      setUri(inUri);
    }
  }, [inUri]);

  return (
    <CustomModal
      title={title}
      visible={visible}
      onClose={onClose}
      padding
    >
      <Image
        source={{ uri }}
        style={styles.image}
      />
    </CustomModal>
  );
}

const styles = StyleSheet.create({
  image: {
    width: deviceWidth,
    height: deviceHeight,
  },
});
