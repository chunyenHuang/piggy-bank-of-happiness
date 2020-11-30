const moment = require('moment');

const {
  updateOrganizations,
  updateOrganizationUsers,
} = require('../lib/db');

const {
  getUser,
  addToGroup,
  updateAttributes,
} = require('../lib/cognito');

module.exports = async ({
  arguments: { input },
  identity,
}) => {
  console.log(JSON.stringify({ input, identity }));
  const currentUsername = identity.username;

  const cognitoUser = await getUser(currentUsername);

  const now = moment().toISOString();

  const organization = Object.assign(input, {
    __typename: 'Organization',
    status: 'Pending',
    isActive: 0,
    createdBy: '系統',
    createdAt: now,
    updatedBy: '系統',
    updatedAt: now,
  });

  const name = cognitoUser.UserAttributes.find(({ Name }) => Name === 'name').Value;
  const email = cognitoUser.UserAttributes.find(({ Name }) => Name === 'email').Value;

  const organizationUser = {
    __typename: 'OrganizationUser',
    organizationId: organization.id,
    username: currentUsername,
    idNumber: 'N/A',
    name,
    email,
    role: 'Admin',
    isActive: 1,
    currentPoints: 0,
    earnedPoints: 0,
    createdBy: '系統',
    createdAt: now,
    updatedBy: '系統',
    updatedAt: now,
  };

  console.log({
    organization,
    organizationUser,
    currentUsername,
    name,
    email,
  });

  await Promise.all([
    updateOrganizations([organization]),
    updateOrganizationUsers([organizationUser]),
    addToGroup(currentUsername, 'OrgAdmins'),
    updateAttributes(currentUsername, organization.id, organization.name, email),
  ]);

  return {
    message: 'success',
    errors: [],
  };
};
