import { Dimensions } from 'react-native';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
export const isIphoneX = Platform.OS === 'ios' &&
  (deviceHeight === 812 ||
    deviceWidth === 812 ||
    deviceHeight === 896 ||
    deviceWidth === 896);

export const isIOS = Platform.OS == 'ios';
export const isAndroid = Platform.OS !== 'ios';
