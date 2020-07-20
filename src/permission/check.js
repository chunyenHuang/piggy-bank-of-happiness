import { AsyncStorage } from 'react-native';
import { PERMISSIONS } from './config';
import { errorAlert } from '../utils/alert';

export default async (permission, alert = false) => {
  const userGroup = await AsyncStorage.getItem('app:group');
  const isAuthorized = (PERMISSIONS[permission] || []).includes(userGroup);

  if (alert && !isAuthorized) {
    errorAlert('抱歉，您的權限不足。');
    return isAuthorized;
  } else {
    return isAuthorized;
  }
};
