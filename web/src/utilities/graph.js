import {
  API,
  graphqlOperation,
} from 'aws-amplify';

import * as retry from 'retry';

/**
 * asyncRetryMutation
 * @param {String} operation GraphQL Operation
 * @param {Object} input Query params
 * @param {Object} options
 * @return {Promise<Object>}
 */
export function asyncRetryMutation(operation, input, options) {
  const retryOptions = Object.assign({
    retries: 3,
    factor: 3,
  }, options);

  return new Promise((resolve, reject) => {
    retry.operation(retryOptions).attempt(async () => {
      try {
        const result = await API.graphql(graphqlOperation(operation, input));
        resolve(result);
      } catch (e) {
        console.error(e);
        reject(e.message || e);
      }
    });
  });
}

/**
 * asyncGet
 * @param {String} operation GraphQL Operation
 * @param {Object} input Query params
 * @param {Object} options
 * @return {Promise<Object>}
 **/
export async function asyncGet(operation, input, options = {}) {
  const result = await API.graphql(graphqlOperation(operation, input));

  return result;
}

/**
 * asyncListAll
 * @param {String} operation GraphQL Operation
 * @param {Object} input Query params
 * @param {Object} options
 * @param {Array} allItems
 * @return {Promise<Array[]>}
 */
export async function asyncListAll(operation, input = {}, options = {}, allItems = []) {
  const res = await API.graphql(graphqlOperation(operation, {
    ...input,
    limit: 100,
  }));

  const { items, nextToken } = res.data[Object.keys(res.data)[0]];
  allItems = [...allItems, ...items];

  if (nextToken) {
    return asyncListAll(operation, { ...input, nextToken }, options, allItems);
  }

  return allItems;
}
