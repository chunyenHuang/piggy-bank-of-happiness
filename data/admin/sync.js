const AWS = require('aws-sdk');
const uuidv1 = require('uuid/v1');

const prompt = require('../prompt');
const { AWS_REGION, AWS_PROFILE, COGNITO_POOLS_ID } = require('../config');
const { getRoleByGroup, writeData } = require('../helper');

AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: AWS_PROFILE });

const cognito = new AWS.CognitoIdentityServiceProvider({ region: AWS_REGION });

// sync CompanyUser with cognito
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

      if (!attributes['custom:organizationId']) {
        return;
      }

      const { Groups: groups } = await cognito.adminListGroupsForUser({
        UserPoolId: COGNITO_POOLS_ID,
        Username: user.Username,
      }).promise();

      const groupName = groups.map(({ GroupName }) => GroupName).filter((x) => !x.includes('_'))[0];

      toUpdateData.push({
        organizationId: attributes['custom:organizationId'],
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
