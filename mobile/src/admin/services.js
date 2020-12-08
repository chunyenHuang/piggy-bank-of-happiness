import { Auth, API } from 'aws-amplify';

import { formatDatetime } from 'src/utils/format';

const LIMIT = 60;
const apiName = 'AdminQueries';

const getHeaders = async () => {
  const token = (await Auth.currentSession()).getAccessToken().getJwtToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token,
  };
};

const normalizeCognitoUserData = (inCognitoUser) => {
  const { Username, UserStatus, Enabled, UserCreateDate, UserLastModifiedDate, Attributes } = inCognitoUser;

  const user = {
    username: Username,
    status: UserStatus,
    isEnabled: Enabled,
    createdAt: formatDatetime(UserCreateDate),
    updatedAt: formatDatetime(UserLastModifiedDate),
  };

  Attributes.forEach(({ Name, Value }) => {
    user[Name] = Value;
  });

  user.isVerified =
    (user.status === 'CONFIRMED' && user['email_verified']) ||
    (user.status === 'EXTERNAL_PROVIDER') ? 1 : 0;

  return user;
};

export function getRoleByGroup(inGroup) {
  switch (inGroup) {
  case 'AppAdmins':
  case 'OrgAdmins':
    return 'Admin';
  case 'OrgManagers':
    return 'Manager';
  case 'Users':
  case 'N/A':
  default:
    return 'User';
  }
}

export async function listUsers(listAll = false, limit = LIMIT, inNextToken, inResults = []) {
  const path = '/listUsers';
  const params = {
    queryStringParameters: {
      limit,
      token: inNextToken,
    },
    headers: await getHeaders(),
  };
  const { NextToken: nextToken, ...rest } = await API.get(apiName, path, params);
  const { Users: users } = rest;

  const results = users.map(normalizeCognitoUserData);

  if (listAll && nextToken) {
    return listUsers(listAll, limit, nextToken, results);
  }

  return {
    nextToken,
    data: [...inResults, ...results],
  };
}

export async function listUsersInGroup(groupname, listAll = false, limit = LIMIT, inNextToken, inResults = []) {
  const path = '/listUsersInGroup';
  const params = {
    queryStringParameters: {
      groupname,
      limit,
      token: inNextToken,
    },
    headers: await getHeaders(),
  };
  const { NextToken: nextToken, Users: users } = await API.get(apiName, path, params);

  const results = users.map(normalizeCognitoUserData);

  if (listAll && nextToken) {
    return listUsersInGroup(groupname, listAll, limit, nextToken, results);
  }

  return {
    nextToken,
    data: [...inResults, ...results],
  };
}

export async function getUserGroup(username) {
  const path = '/listGroupsForUser';
  const params = {
    queryStringParameters: {
      username,
    },
    headers: await getHeaders(),
  };
  const { Groups } = await API.get(apiName, path, params);
  return Groups
    .map(({ GroupName }) => GroupName)
    .filter((x) => !x.includes('_'))[0]; // FB, google
}

export async function updateUserAttributes(username, attributes = {}) {
  const path = '/updateUserAttributes';
  const params = {
    body: {
      username,
      attributes,
    },
    headers: await getHeaders(),
  };
  return API.post(apiName, path, params);
}

export async function addUserToGroup(username, groupname) {
  const path = '/addUserToGroup';
  const params = {
    body: {
      username,
      groupname,
    },
    headers: await getHeaders(),
  };
  return API.post(apiName, path, params);
}

export async function removeUserFromGroup(username, groupname) {
  const path = '/removeUserFromGroup';
  const params = {
    body: {
      username,
      groupname,
    },
    headers: await getHeaders(),
  };
  return API.post(apiName, path, params);
}

// export async function updateUser(attributes = {}, )
// let result = await Auth.updateUserAttributes(user, {
// 	email: 'me@anotherdomain.com',
// 	family_name: 'Lastname',
// });

// addUserToGroup
// POST {username, groupname}

// removeUserFromGroup 
// POST {username, groupname}

// listGroupsForUser
// GET {username}

// disableUser or enableUser
// POST {username}
