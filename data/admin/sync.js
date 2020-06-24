const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');

const prompt = require('../prompt');
const { AWS_REGION, AWS_PROFILE, COGNITO_POOLS_ID } = require('../config');
const { getRoleByGroup, writeData } = require('../helper');

AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: AWS_PROFILE });

const cognito = new AWS.CognitoIdentityServiceProvider({ region: AWS_REGION });

// sync CompanyUser with cognito

// add user to the test org automatically
const DEFAULT_ORG_ID = '58e127ce-b36c-11ea-b3de-0242ac130004';

(async () => {
  try {
    const {
      env: ENV,
      hash: HASH,
    } = await prompt(1);

    const { Users: cognitoUsers } = await cognito.listUsers({
      UserPoolId: COGNITO_POOLS_ID,
    }).promise();

    const toUpdateData = [];
    const setGroupsPromises = cognitoUsers.map(async (user) => {
      const attributes = user.Attributes.reduce((obj, item) => {
        obj[item.Name] = item.Value;
        return obj;
      }, {});

      const { Groups: groups } = await cognito.adminListGroupsForUser({
        UserPoolId: COGNITO_POOLS_ID,
        Username: user.Username,
      }).promise();

      const groupName = groups.map(({ GroupName }) => GroupName).filter((x) => !x.includes('_'))[0];

      // User does not have a valid group, add to the OrgAdmins
      if (!groupName) {
        const addParams = {
          GroupName: 'OrgAdmins',
          UserPoolId: COGNITO_POOLS_ID,
          Username: user.Username,
        };
        await cognito.adminAddUserToGroup(addParams).promise();
      }

      if (!attributes['custom:organizationId']) {
        const updateParams = {
          UserAttributes: [
            {
              Name: 'custom:organizationId',
              Value: DEFAULT_ORG_ID,
            },
            {
              Name: 'custom:organizationName',
              Value: '小豬銀行',
            }],
          UserPoolId: COGNITO_POOLS_ID,
          Username: user.Username,
        };

        await cognito.adminUpdateUserAttributes(updateParams).promise();
      }

      toUpdateData.push({
        organizationId: attributes['custom:organizationId'] || DEFAULT_ORG_ID,
        username: user.Username,
        idNumber: uuidv1(),
        name: attributes['name'],
        role: getRoleByGroup(groupName),
        isActive: 1,
        currentPoints: 0,
        earnedPoints: 0,
      });
    });

    await Promise.all(setGroupsPromises);

    await writeData(HASH, ENV, 'OrganizationUser', toUpdateData);
  } catch (e) {
    console.log(e);
  }
})();
