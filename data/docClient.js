const AWS = require('aws-sdk');
const { AWS_PROFILE, AWS_REGION } = require('./config');
const credentials = new AWS.SharedIniFileCredentials({ profile: AWS_PROFILE });
AWS.config.credentials = credentials;
const config = {
  region: AWS_REGION,
};
const docClient = new AWS.DynamoDB.DocumentClient(config);

module.exports = docClient;

docClient.queryAll = async (inParams, inPreviousItems = []) => {
  const { Items, LastEvaluatedKey } = await docClient.query(inParams).promise();

  let items;
  if (LastEvaluatedKey) {
    inParams.ExclusiveStartKey = LastEvaluatedKey;
    items = await docClient.queryAll(inParams, Items);
  } else {
    items = Items;
  }
  return [...items, ...inPreviousItems];
};

docClient.scanAll = async (inParams, inPreviousItems = []) => {
  const { Items, LastEvaluatedKey } = await docClient.scan(inParams).promise();
  inParams.ExclusiveStartKey = LastEvaluatedKey;

  let items;
  if (LastEvaluatedKey) {
    inParams.ExclusiveStartKey = LastEvaluatedKey;
    items = await new Promise((resolve, reject) => {
      setTimeout(() => {
        return docClient.scanAll(inParams, Items).then(resolve).catch(reject);
      }, 500);
    });
  } else {
    items = Items;
  }
  return [...items, ...inPreviousItems];
};

docClient.batchUpdate = (inTableName, inData = [], inBatchUpdateInterval = 2000, inPrimaryKey = null, inSortKey = null) => {
  return batchAction(inTableName, 'PutRequest', inPrimaryKey, inSortKey, inData, inBatchUpdateInterval);
};

docClient.batchDelete = (inTableName, inPrimaryKey, inSortKey, inData = [], inBatchUpdateInterval = 2000) => {
  return batchAction(inTableName, 'DeleteRequest', inPrimaryKey, inSortKey, inData, inBatchUpdateInterval);
};

/**
 * batchAction
 * @param {*} inTableName
 * @param {*} inRequestAction
 * @param {*} inPrimaryKey
 * @param {*} inSortKey
 * @param {*} inData
 * @param {*} inBatchUpdateInterval
 * @return {Promise}
 */
async function batchAction(inTableName, inRequestAction, inPrimaryKey, inSortKey, inData, inBatchUpdateInterval = 2000) {
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
  return tasks.reduce(async (chainPromise, taskParams) => {
    await chainPromise;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return docClient.batchWrite(taskParams).promise()
          .then(resolve)
          .catch((err) => {
            console.log(err);
            return reject(new Error({
              params: taskParams,
              error: err,
            }));
          });
      }, inBatchUpdateInterval);
    });
  }, Promise.resolve());
}
