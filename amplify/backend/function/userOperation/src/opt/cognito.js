const aws = require('aws-sdk'); /* eslint-disable-line */

const {
  AUTH_PIGGYBANKOFHAPPINESSCF2E2C90_USERPOOLID,
} = process.env;

const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

module.exports = {
  async getUser(username) {
    try {
      const params = {
        UserPoolId: AUTH_PIGGYBANKOFHAPPINESSCF2E2C90_USERPOOLID,
        Username: username,
      };
      const user = await cognitoidentityserviceprovider.adminGetUser(params).promise();
      return user;
    } catch (e) {
      if (e.code === 'UserNotFoundException') {
        return null;
      } else {
        throw e;
      }
    }
  },

  async deleteUser(username) {
    const params = {
      UserPoolId: AUTH_PIGGYBANKOFHAPPINESSCF2E2C90_USERPOOLID,
      Username: username,
    };
    return cognitoidentityserviceprovider.adminDeleteUser(params).promise();
  },

  async createUser(username, name, email, password) {
    const tmpPassword = randomString();
    const params = {
      UserPoolId: AUTH_PIGGYBANKOFHAPPINESSCF2E2C90_USERPOOLID,
      Username: username,
      DesiredDeliveryMediums: ['EMAIL'],
      TemporaryPassword: password || tmpPassword,
      UserAttributes: [
        {
          Name: 'name',
          Value: name,
        },
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
    };
    await cognitoidentityserviceprovider.adminCreateUser(params).promise();

    if (password) {
      await cognitoidentityserviceprovider.adminSetUserPassword({
        UserPoolId: AUTH_PIGGYBANKOFHAPPINESSCF2E2C90_USERPOOLID,
        Username: username,
        Password: password,
        Permanent: true,
      }).promise();
    }
  },

  async updateAttributes(username, organizationId, organizationName, email) {
    const params = {
      UserPoolId: AUTH_PIGGYBANKOFHAPPINESSCF2E2C90_USERPOOLID,
      Username: username,
      UserAttributes: [
        {
          Name: 'custom:organizationId',
          Value: organizationId,
        },
        {
          Name: 'custom:organizationName',
          Value: organizationName,
        },
        {
          Name: 'email',
          Value: email,
        },
      ],
    };

    await cognitoidentityserviceprovider.adminUpdateUserAttributes(params).promise();
  },

  async addToGroup(username, inGroupName) {
    // check if user belongs to the group already
    const listGroupsParams = {
      UserPoolId: AUTH_PIGGYBANKOFHAPPINESSCF2E2C90_USERPOOLID,
      Username: username,
    };
    const { Groups } = await cognitoidentityserviceprovider.adminListGroupsForUser(listGroupsParams).promise();

    const matched = Groups.find(({ GroupName }) => GroupName === inGroupName);
    if (matched) return;

    // remove all groups
    const promises = Groups.map(({ GroupName }) => {
      const params = {
        GroupName,
        UserPoolId: AUTH_PIGGYBANKOFHAPPINESSCF2E2C90_USERPOOLID,
        Username: username,
      };
      return cognitoidentityserviceprovider.adminRemoveUserFromGroup(params).promise();
    });
    await Promise.all(promises);

    // add to group
    const addUserParams = {
      GroupName: inGroupName,
      UserPoolId: AUTH_PIGGYBANKOFHAPPINESSCF2E2C90_USERPOOLID,
      Username: username,
    };

    await cognitoidentityserviceprovider.adminAddUserToGroup(addUserParams).promise();
  },

  async removeUserGroups(username) {
    const listGroupsParams = {
      UserPoolId: AUTH_PIGGYBANKOFHAPPINESSCF2E2C90_USERPOOLID,
      Username: username,
    };

    const { Groups } = await cognitoidentityserviceprovider.adminListGroupsForUser(listGroupsParams).promise();
    if (Groups.length > 0) {
      const promises = Groups.map(({ GroupName }) => {
        const params = {
          GroupName,
          UserPoolId: AUTH_PIGGYBANKOFHAPPINESSCF2E2C90_USERPOOLID,
          Username: username,
        };
        return cognitoidentityserviceprovider.adminRemoveUserFromGroup(params).promise();
      });
      await Promise.all(promises);
    }
  },

};

function randomString() {
  return Math.random().toString(36).substring(2, 10);
}
