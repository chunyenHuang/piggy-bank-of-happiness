import { Alert } from 'react-native';

export const errorAlert = (err) => {
  global.logger.error(err);
  Alert.alert(
    `${JSON.stringify(err.message || err)}`,
    ``,
    [
      { text: 'OK', onPress: () => {} },
    ], { cancelable: false },
  );
};
