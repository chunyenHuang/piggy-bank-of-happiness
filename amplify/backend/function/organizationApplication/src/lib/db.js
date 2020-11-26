const docClient = require('./docClient');

const {
  API_PIGGYBANKOFHAPPINESS_ORGANIZATIONTABLE_NAME,
  API_PIGGYBANKOFHAPPINESS_ORGANIZATIONUSERTABLE_NAME,
} = process.env;

module.exports = {
  async getOrganization(id) {
    const params = {
      TableName: API_PIGGYBANKOFHAPPINESS_ORGANIZATIONTABLE_NAME,
      Key: {
        id,
      },
    };

    const { Item } = await docClient.get(params).promise();
    return Item;
  },
  async updateOrganizations(items = []) {
    if (items.length === 0) return;

    return docClient.batchUpdate(API_PIGGYBANKOFHAPPINESS_ORGANIZATIONTABLE_NAME, items, 300);
  },
  async getOrganizationUser(organizationId, username) {
    const params = {
      TableName: API_PIGGYBANKOFHAPPINESS_ORGANIZATIONUSERTABLE_NAME,
      Key: {
        organizationId,
        username,
      },
    };

    const { Item } = await docClient.get(params).promise();
    return Item;
  },
  async updateOrganizationUsers(users = []) {
    if (users.length === 0) return;

    return docClient.batchUpdate(API_PIGGYBANKOFHAPPINESS_ORGANIZATIONUSERTABLE_NAME, users, 300);
  },
};
