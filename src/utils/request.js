import API, { graphqlOperation } from '@aws-amplify/api';
import to from 'await-to-js';
const THRESHOLD = 500;

export default async (query, params, authMode) => {
  const startedAt = Date.now();
  const options = graphqlOperation(query, params);
  // https://github.com/aws-amplify/amplify-js/blob/master/packages/api/src/types/index.ts#L75
  options.authMode = authMode || 'AMAZON_COGNITO_USER_POOLS';
  // global.logger.debug(options);
  const [err, res] = await to(API.graphql(options));

  if (__DEV__) {
    // global.logger.debug(JSON.stringify(res, null, 2));

    const time = Date.now() - startedAt;
    const name = `${query.split('(')[0].replace(/ +/g, ' ').replace(/\n+/g, '')}`;
    global.logger.info(`API:${name} ${time} ms ${time>THRESHOLD?'***':''}`);
  }

  if (err) {
    if (__DEV__) {
      global.logger.debug(query);
      global.logger.debug(JSON.stringify(params || {}, null, 2));
      console.log(err);
    }
    global.logger.error(err);
    throw err;
  }

  return res;
};
