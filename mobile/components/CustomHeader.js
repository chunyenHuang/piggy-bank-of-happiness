import React from 'react';
import { Header } from 'react-native-elements';

import { getHeaderProps } from 'src/utils/device';
import Colors from 'constants/Colors';

export default function CustomHeader({ title, leftComponent, rightComponent }) {
  return (
    <Header
      barStyle={'light-content'}
      backgroundColor={Colors.primary}
      containerStyle={getHeaderProps()}
      leftComponent={leftComponent}
      centerComponent={{
        text: title,
        style: { color: '#fff', fontSize: 16 },
      }}
      rightComponent={rightComponent}
    />
  );
}
