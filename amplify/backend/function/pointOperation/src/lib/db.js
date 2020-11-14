const docClient = require('./docClient');

const {
  API_PIGGYBANKOFHAPPINESS_ORGANIZATIONUSERTABLE_NAME,
  API_PIGGYBANKOFHAPPINESS_ORGANIZATIONTASKTABLE_NAME,
  API_PIGGYBANKOFHAPPINESS_ORGANIZATIONTRANSACTIONTABLE_NAME,
  API_PIGGYBANKOFHAPPINESS_ORGANIZATIONUSERTASKTABLE_NAME,
  API_PIGGYBANKOFHAPPINESS_ORGANIZATIONREWARDTABLE_NAME,
} = process.env;

exports.getOrgUser = async (organizationId, username) => {
  const { Item } = await docClient.get({
    TableName: API_PIGGYBANKOFHAPPINESS_ORGANIZATIONUSERTABLE_NAME,
    Key: { organizationId, username },
  }).promise();

  return Item;
};

exports.getOrgTask = async (organizationId, id) => {
  const { Item } = await docClient.get({
    TableName: API_PIGGYBANKOFHAPPINESS_ORGANIZATIONTASKTABLE_NAME,
    Key: { organizationId, id },
  }).promise();

  return Item;
};

exports.getOrgTransaction = async (organizationId, id) => {
  const { Item } = await docClient.get({
    TableName: API_PIGGYBANKOFHAPPINESS_ORGANIZATIONTRANSACTIONTABLE_NAME,
    Key: { organizationId, id },
  }).promise();

  return Item;
};

exports.getOrgReward = async (organizationId, id) => {
  const { Item } = await docClient.get({
    TableName: API_PIGGYBANKOFHAPPINESS_ORGANIZATIONREWARDTABLE_NAME,
    Key: { organizationId, id },
  }).promise();

  return Item;
};


const update = async (tableName, items) => {
  if (items.length === 0) return [];
  await docClient.batchUpdate(tableName, items);
};

exports.updateOrgUser = (items) => {
  return update(API_PIGGYBANKOFHAPPINESS_ORGANIZATIONUSERTABLE_NAME, items);
};

exports.updateOrgUserTask = (items) => {
  return update(API_PIGGYBANKOFHAPPINESS_ORGANIZATIONUSERTASKTABLE_NAME, items);
};

exports.updateOrgTransaction = (items) => {
  return update(API_PIGGYBANKOFHAPPINESS_ORGANIZATIONTRANSACTIONTABLE_NAME, items);
};

exports.updateOrgReward = (items) => {
  return update(API_PIGGYBANKOFHAPPINESS_ORGANIZATIONREWARDTABLE_NAME, items);
};
