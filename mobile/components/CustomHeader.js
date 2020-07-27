import React from 'react';
import { Header } from 'react-native-elements';

import { isIphoneX } from 'src/utils/device';

export default function CustomHeader({ title, leftComponent, rightComponent }) {
  return (
    <Header
      barStyle={'light-content'}
      containerStyle={{
        height: Platform.OS == 'ios' ?
          (isIphoneX ? 80: 60) : 40,
        paddingTop: Platform.OS == 'ios' ?
          (isIphoneX ? 40: 20): 0,
      }}
      leftComponent={leftComponent}
      centerComponent={{
        text: title,
        style: { color: '#fff', fontSize: 16 },
      }}
      rightComponent={rightComponent}
    />
  );
}
