const aws = require('aws-sdk');

const GROUPNAME = process.env.GROUP || 'Users';

exports.handler = async (event, context, callback) => {
  const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
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
    const getGroupsParams = {
      UserPoolId: event.userPoolId,
      Username: event.userName,
    };

    const { Groups } = await cognitoidentityserviceprovider.adminListGroupsForUser(getGroupsParams).promise();

    if (Groups.length === 0) {
      const addUserParams = {
        GroupName: GROUPNAME,
        UserPoolId: event.userPoolId,
        Username: event.userName,
      };

      await cognitoidentityserviceprovider.adminAddUserToGroup(addUserParams).promise();
    }

    callback(null, event);
  } catch (e) {
    callback(e);
  }
};
