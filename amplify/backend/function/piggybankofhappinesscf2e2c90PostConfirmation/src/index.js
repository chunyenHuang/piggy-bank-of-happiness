const aws = require('aws-sdk');

const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

const GROUPNAME = process.env.GROUP || 'Users';

exports.handler = async (event, context, callback) => {
  console.log(event);
  // const groupParams = {
  //   GroupName: GROUPNAME,
  //   UserPoolId: event.userPoolId,
  // };

  // try {
  //   await cognitoidentityserviceprovider.getGroup(groupParams).promise();
  // } catch (e) {
  //   await cognitoidentityserviceprovider.createGroup(groupParams).promise();
  // }

  try {
    const { userAttributes } = event.request;
    // first time user
    if (!userAttributes['custom:organizationId']) {
      const startedAt = Date.now();
      const addUserParams = {
        GroupName: GROUPNAME,
        UserPoolId: event.userPoolId,
        Username: event.userName,
      };

      await cognitoidentityserviceprovider.adminAddUserToGroup(addUserParams).promise();
      console.log(Date.now() - startedAt);
    }

    callback(null, event);
  } catch (e) {
    callback(e);
  }
};
