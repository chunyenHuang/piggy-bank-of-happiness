const moment = require('moment');
const docClient = require('./docClient');

export async function writeData(hash, env, name, data) {
  const tableName = `${name}-${hash}-${env}`;
  data = data.map((item) => {
    return Object.assign({
      __typename: name,
      createdAt: moment().toISOString(),
      updatedAt: moment().toISOString(),
    }, item);
  });
  await docClient.batchUpdate(tableName, data, 300);
}

export async function purgeTable(hash, env, name, partitionKey, sortKey) {
  const tableName = `${name}-${hash}-${env}`;
  const params = {
    TableName: tableName,
  };
  const res = await docClient.scan(params).promise();

  await docClient.batchDelete(tableName, partitionKey, sortKey, res.Items, 300);
  if (res.LastEvaluatedKey) {
    return purgeTable(hash, env, name, partitionKey, sortKey);
  }
}

export function getRoleByGroup(inGroup) {
  switch (inGroup) {
  case 'AppAdmins':
  case 'OrgAdmins':
    return 'Admin';
  case 'OrgManagers':
    return 'Manager';
  case 'N/A':
  default:
    return 'User';
  }
}
