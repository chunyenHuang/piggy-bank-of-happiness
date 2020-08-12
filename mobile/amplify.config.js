import { Linking } from 'expo';
import * as WebBrowser from 'expo-web-browser';
import { Hub } from 'aws-amplify';

import awsconfig from './aws-exports';

const APP_SCHEME = 'happinessbankbook';

const amplifyConfig = {
  ...awsconfig,
  oauth: {
    ...awsconfig.oauth,
    urlOpener: async (url, redirectUrl) => {
      try {
        // On Expo, use WebBrowser.openAuthSessionAsync to open the Hosted UI pages.
        const { type, url: newUrl } = await WebBrowser.openAuthSessionAsync(url, redirectUrl);

        if (type !== 'success') {
          return Hub.dispatch('app', { event: 'oauth_cancel' });
        }

        await WebBrowser.dismissBrowser();

        if (Platform.OS === 'ios') {
          await Linking.openURL(newUrl);
        }
      } catch (e) {
        Hub.dispatch('app', { event: 'oauth_failed' });
        throw new Error(e);
      }
    },
    options: {
      // Indicates if the data collection is enabled to support Cognito advanced security features. By default, this flag is set to true.
      AdvancedSecurityDataCollectionFlag: true,
    },
  },
};

// https://docs.expo.io/versions/latest/workflow/linking/#linking-module
let redirectUrl = Linking.makeUrl();
if (redirectUrl.startsWith('exp://1')) {
  redirectUrl = redirectUrl + '/--/';
} else
if (redirectUrl.startsWith(`${APP_SCHEME}://`)) {
  // https://github.com/aws-amplify/amplify-js/issues/4244#issuecomment-552955226
} else {
  redirectUrl = redirectUrl + '/';
}
amplifyConfig.oauth.redirectSignIn = redirectUrl;
amplifyConfig.oauth.redirectSignOut = redirectUrl;

amplifyConfig.env = amplifyConfig.aws_cloud_logic_custom[0].endpoint.split('/').pop();

export default amplifyConfig;
