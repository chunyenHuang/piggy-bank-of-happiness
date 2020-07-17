const AWS = require('aws-sdk');
const inquirer = require('inquirer');
const uuidv1 = require('uuid/v1');

const prompt = require('../prompt');
const docClient = require('../docClient');
const { AWS_REGION, AWS_PROFILE, COGNITO_POOLS_ID } = require('../config');
const { getRoleByGroup, writeData } = require('../helper');

AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: AWS_PROFILE });

const cognito = new AWS.CognitoIdentityServiceProvider({ region: AWS_REGION });

(async () => {
  try {
    const {
      env: ENV,
      hash: HASH,
    } = await prompt(1);

    await ensureCustomFields();

    const orgOptions = (await docClient.scanAll({ TableName: `Organization-${HASH}-${ENV}` })).map((item) => {
      return {
        name: item.name,
        value: item,
      };
    });

    const orgAnswers = await inquirer.prompt([
      { name: 'organization', message: 'Organization', type: 'list', choices: orgOptions },
    ]);

    const userAnswers = await inquirer.prompt([
      { name: 'username', message: 'Username', type: 'input' },
      { name: 'name', message: 'Name', type: 'input' },
      { name: 'email', message: 'Email', type: 'input' },
      {
        name: 'group',
        message: 'Group?',
        type: 'list',
        choices: ['OrgAdmins', 'OrgManagers', 'AppAdmins', 'N/A'],
        default: 'OrgAdmins',
      },
    ]);

    const inputParams = Object.assign({
      organizationId: orgAnswers.organization.id,
      organizationName: orgAnswers.organization.name,
      role: getRoleByGroup(userAnswers.group),
    }, userAnswers);

    console.log(inputParams);

    const confirmAnswer = await inquirer.prompt([
      { name: 'confirm', message: 'Is the above information correct?', type: 'confirm', default: false },
    ]);

    if (!confirmAnswer.confirm) {
      return;
    }

    const createParams = {
      UserPoolId: COGNITO_POOLS_ID,
      Username: inputParams.username,
      DesiredDeliveryMediums: ['EMAIL'],
      TemporaryPassword: 'password', // randomString(),
      UserAttributes: [
        {
          Name: 'name',
          Value: inputParams.name,
        },
        {
          Name: 'email',
          Value: inputParams.email,
        },
        {
          Name: 'email_verified',
          Value: 'true',
        }],
    };
    console.log(createParams);
    await cognito.adminCreateUser(createParams).promise();

    const params = {
      UserPoolId: COGNITO_POOLS_ID,
      Username: inputParams.username,
    };
    const user = await cognito.adminGetUser(params).promise();
    console.log(user);

    if (inputParams.group !== 'N/A') {
      const groupParams = {
        UserPoolId: COGNITO_POOLS_ID,
        Username: inputParams.username,
      };
      const { Groups } = await cognito.adminListGroupsForUser(groupParams).promise();
      if (Groups[0] && Groups[0].GroupName !== inputParams.group) {
        console.log(`Remove user from group: ${Groups[0].GroupName}`);
        const removeParams = {
          GroupName: Groups[0].GroupName,
          UserPoolId: COGNITO_POOLS_ID,
          Username: inputParams.username,
        };
        await cognito.adminRemoveUserFromGroup(removeParams).promise();
      }

      // Update Group
      console.log(`Add user to group: ${inputParams.group}`);
      const addParams = {
        GroupName: inputParams.group,
        UserPoolId: COGNITO_POOLS_ID,
        Username: inputParams.username,
      };
      await cognito.adminAddUserToGroup(addParams).promise();
    }

    // Change Org
    console.log(`Update user's org`);
    const updateParams = {
      UserAttributes: [
        {
          Name: 'custom:organizationId',
          Value: inputParams.organizationId,
        },
        {
          Name: 'custom:organizationName',
          Value: inputParams.organizationName,
        }],
      UserPoolId: COGNITO_POOLS_ID,
      Username: inputParams.username,
    };

    await cognito.adminUpdateUserAttributes(updateParams).promise();

    // OrganizationUser
    console.log(`add user to the ddb table`);
    const orgUserData = {
      // organizationName: inputParams.organizationName,
      organizationId: inputParams.organizationId,
      username: inputParams.username,
      idNumber: uuidv1(),
      name: inputParams.name,
      role: inputParams.role,
      isActive: 1,
      currentPoints: 0,
      earnedPoints: 0,
    };
    await writeData(HASH, ENV, 'OrganizationUser', [orgUserData]);
  } catch (e) {
    console.log(e);
  }
})();

async function ensureCustomFields() {
  try {
    const schemaParams = {
      CustomAttributes: [
        {
          AttributeDataType: 'String',
          DeveloperOnlyAttribute: false,
          Mutable: true,
          Name: 'organizationId',
          Required: false,
        },
        {
          AttributeDataType: 'String',
          DeveloperOnlyAttribute: false,
          Mutable: true,
          Name: 'organizationName',
          Required: false,
        }],
      UserPoolId: COGNITO_POOLS_ID,
    };
    await cognito.addCustomAttributes(schemaParams).promise();
  } catch (e) {
    if (!e.message.includes('Existing attribute already')) {
      throw new Error(e);
    }
  }
}

function randomString() {
  return Math.random().toString(36).substring(2, 10);
}
