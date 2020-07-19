const moment = require('moment');
const AWS = require('aws-sdk');

const { AWS_PROFILE, AWS_REGION } = require('./config');
const docClient = require('./docClient');

const credentials = new AWS.SharedIniFileCredentials({ profile: AWS_PROFILE });
AWS.config.credentials = credentials;
const config = {
  region: AWS_REGION,
};
const dynamodb = new AWS.DynamoDB(config);

export async function writeData(tableName, typeName, data = []) {
  data = data.map((item) => {
    item = Object.assign({
      __typename: typeName,
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    }, item);
    Object.keys(item).forEach((key) => {
      if (item[key] === '') {
        delete item[key];
      }
    });

    return item;
  });
  await docClient.batchUpdate(tableName, data, 300);
}

export async function purgeTable(tableName, partitionKey, sortKey) {
  if (!partitionKey) {
    const { Table: { KeySchema } } = await dynamodb.describeTable({ TableName: tableName }).promise();
    partitionKey = KeySchema.find(({ KeyType }) => KeyType === 'HASH');
    sortKey = KeySchema.find(({ KeyType }) => KeyType === 'HASH');
  }

  const params = {
    TableName: tableName,
  };
  const { Items, LastEvaluatedKey } = await docClient.scan(params).promise();

  await docClient.batchDelete(tableName, partitionKey, sortKey, Items, 300);
  if (LastEvaluatedKey) {
    return purgeTable(tableName, partitionKey, sortKey);
  }
}

export function getRoleByGroup(inGroup) {
  switch (inGroup) {
  case 'AppAdmins':
  case 'OrgAdmins':
    return 'Admin';
  case 'OrgManagers':
    return 'Manager';
  case 'User':
  case 'N/A':
  default:
    return 'User';
  }
}

export function randomString() {
  return Math.random().toString(36).substring(2, 10);
}
