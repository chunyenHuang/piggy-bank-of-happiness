import { Alert } from 'react-native';

global.logger = {
  debug(...args) { __DEV__ ? console.log('[DEBUG]', ...args) : '' },
  info(...args) { __DEV__ ? console.log('[INFO]', ...args) : '' },
  warn(...args) { __DEV__ ? console.warn('[WARNING]', ...args) : '' },
  error(content) {
    console.error('[ERROR]', content);
    let errMsg;
    if (content.errors && content.errors.length > 0) {
      errMsg = content.errors[0].message;
    } else
    if (typeof content === 'string') {
      errMsg = content;
    }

    Alert.alert('Error', `${errMsg}`, [{ text: 'ok' }])
  }
}

// Disable warning message
console.disableYellowBox = true;
