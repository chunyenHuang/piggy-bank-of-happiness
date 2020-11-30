import { AsyncStorage } from 'react-native';

import { errorAlert } from 'src/utils/alert';

import { PERMISSIONS } from './config';

export default async (permission, alert = false) => {
  const userGroup = await AsyncStorage.getItem('app:group');
  const isAuthorized = (PERMISSIONS[permission] || []).includes(userGroup);

  if (alert && !isAuthorized) {
    errorAlert('抱歉，您的權限不足。', false);
    return isAuthorized;
  } else {
    return isAuthorized;
  }
};
