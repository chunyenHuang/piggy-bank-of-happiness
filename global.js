// import Amplify from 'aws-amplify';
import { Logger } from 'aws-amplify';

// Amplify.Logger.LOG_LEVEL = 'INFO';

const logLevel = __DEV__ ? 'DEBUG' : 'ERROR';
const logger = new Logger('pboh', logLevel);

global.logger = logger;

// Disable warning message
console.disableYellowBox = true; /* eslint-disable-line no-console */
