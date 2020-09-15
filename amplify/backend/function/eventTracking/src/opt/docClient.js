const { DynamoDB } = require('aws-sdk');
const { REGION } = process.env;

const docClient = new DynamoDB.DocumentClient({ region: REGION });

module.exports = docClient;

/**
 * @memberof module:got.dynamoDB.docClient
 * @method batchUpdate
 * @summary Batch update with a delay between optimally sized writes.
 * @param {String} inTableName
 * @param {Array} inData
 * @param {Number} inBatchUpdateInterval
 * @param {String} inPrimaryKey
 * @param {String} inSortKey
 * @return {Promise}
 */
docClient.batchUpdate = (inTableName, inData = [], inBatchUpdateInterval = 2000, inPrimaryKey = null, inSortKey = null) => {
  return batchAction(inTableName, 'PutRequest', inPrimaryKey, inSortKey, inData, inBatchUpdateInterval);
};

/**
 * @memberof module:got.dynamoDB.docClient
 * @method batchDelete
 * @summary Batch delete with a delay between optimally sized writes.
 * @param {String} inTableName
 * @param {String} inPrimaryKey
 * @param {String} inSortKey
 * @param {Array} inData
 * @param {Number} inBatchUpdateInterval
 * @return {Promise}
 */
docClient.batchDelete = (inTableName, inPrimaryKey, inSortKey, inData = [], inBatchUpdateInterval = 2000) => {
  return batchAction(inTableName, 'DeleteRequest', inPrimaryKey, inSortKey, inData, inBatchUpdateInterval);
};

/**
 * @memberof module:got.dynamoDB.docClient
 * @method queryAll
 * @summary Query all the items
 * @param {Object} inParams
 * @param {Array} inPreviousItems
 * @return {Promise<Array>} Items
 */
docClient.queryAll = (inParams, inPreviousItems = []) => {
  return docClient.query(inParams).promise()
    .then((res) => {
      const { Items, LastEvaluatedKey } = res;
      if (LastEvaluatedKey) {
        inParams.ExclusiveStartKey = LastEvaluatedKey;
        return docClient.queryAll(inParams, Items);
      } else {
        return Items;
      }
    })
    .then((items) => {
      return [...items, ...inPreviousItems];
    });
};

/**
 * @memberof module:got.dynamoDB.docClient
 * @method scanAll
 * @summary Scan all the items
 * @param {Object} inParams
 * @param {Array} inPreviousItems
 * @return {Promise<Array>} Items
 */
docClient.scanAll = (inParams, inPreviousItems = []) => {
  return docClient.scan(inParams).promise()
    .then((res) => {
      const { Items, LastEvaluatedKey } = res;
      if (LastEvaluatedKey) {
        inParams.ExclusiveStartKey = LastEvaluatedKey;
        return docClient.scanAll(inParams, Items);
      } else {
        return Items;
      }
    })
    .then((items) => {
      return [...items, ...inPreviousItems];
    });
};

/**
 * @memberof module:got.dynamoDB.docClient
 * @method batchAction
 * @summary Batch action with a delay between optimally sized writes.
 * @param {String} inTableName
 * @param {String} inRequestAction
 * @param {String} inPrimaryKey
 * @param {String} inSortKey
 * @param {Array} inData
 * @param {Number} inBatchUpdateInterval
 * @return {Promise}
 */
function batchAction(inTableName, inRequestAction, inPrimaryKey, inSortKey, inData, inBatchUpdateInterval = 2000) {
  const maxItemsInBatch = 24;
  let startIndex = 0;
  let endIndex = maxItemsInBatch;
  if (endIndex > inData.length) {
    endIndex = inData.length;
  }
  const tasks = [];
  while (endIndex <= inData.length && startIndex !== endIndex) {
    const toModifyData = [];
    for (let index = startIndex; index < endIndex; index++) {
      if (index >= inData.length) {
        break;
      }
      const item = inData[index];
      const modifyRequest = {
        [inRequestAction]: {},
      };
      switch (inRequestAction) {
      case 'PutRequest':
        modifyRequest[inRequestAction].Item = item;
        break;
      default:
        modifyRequest[inRequestAction].Key = {
          [inPrimaryKey]: item[inPrimaryKey],
        };
        break;
      }
      if (inSortKey) {
        modifyRequest[inRequestAction].Key[inSortKey] = item[inSortKey];
      }
      toModifyData.push(modifyRequest);
    }
    const params = {
      RequestItems: {
        [inTableName]: toModifyData,
      },
    };

    startIndex = endIndex;
    endIndex += maxItemsInBatch;
    if (endIndex > inData.length) {
      endIndex = inData.length;
    }
    tasks.push(params);
  }

  const unprocessedParams = [];
  const failed = [];

  const chainProcess = tasks.reduce((chainPromise, taskParams, index) => {
    return chainPromise
      .then(() => {
        return new Promise((resolve, reject) => {
          const interval = index === 0 ? 0 : inBatchUpdateInterval;
          setTimeout(() => {
            return docClient.batchWrite(taskParams).promise()
              .then(({ UnprocessedItems }) => {
                if (Object.keys(UnprocessedItems).length > 0) {
                  unprocessedParams.push(UnprocessedItems);
                }
                return resolve();
              })
              .catch((err) => {
                // eslint-disable-next-line
                return reject({
                  params: taskParams,
                  error: err,
                });
              });
          }, interval);
        });
      });
  }, Promise.resolve());

  const handleUnprocessedItems = () => {
    if (unprocessedParams.length === 0) return;

    console.log('retry unprocessed params', unprocessedParams);
    // try one more time for the unprocessed items
    return unprocessedParams.reduce((chain, requestParams, index) => {
      return chain
        .then(() => {
          return new Promise((resolve, reject) => {
            const interval = index === 0 ? 0 : inBatchUpdateInterval;
            setTimeout(() => {
              const params = {
                RequestItems: requestParams,
              };
              return docClient.batchWrite(params).promise()
                .then(({ UnprocessedItems }) => {
                  if (Object.keys(UnprocessedItems).length > 0) {
                    failed.push(UnprocessedItems);
                  }
                  return resolve();
                })
                .catch((err) => {
                  // eslint-disable-next-line
                  return reject({
                    params,
                    error: err,
                  });
                });
            }, interval);
          });
        });
    }, Promise.resolve());
  };

  return chainProcess
    .then(() => {
      return handleUnprocessedItems();
    })
    .then(() => {
      return failed;
    });
}
