import { Alert, AsyncStorage } from 'react-native';
import { PERMISSIONS } from './config';

export default async (permission, alert = false) => {
  const userGroup = await AsyncStorage.getItem('app:group');
  const isAuthorized = (PERMISSIONS[permission] || []).includes(userGroup);

  if (alert && !isAuthorized) {
    Alert.alert(
      '抱歉，您的權限不足。',
      '', [
        {
          text: 'ok',
          onPress: () => {},
        }], { cancelable: true });
    return isAuthorized;
  } else {
    return isAuthorized;
  }
};
