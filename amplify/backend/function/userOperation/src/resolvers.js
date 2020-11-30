const {
  getOrganization,
  getOrganizationUser,
  updateOrganizationUsers,
} = require('./opt/ddb');

const {
  getUser,
  createUser,
  addToGroup,
  updateAttributes,
} = require('./opt/cognito');

module.exports = {
  Mutation: {
    userOperation: async ({
      arguments: { input },
      identity,
    }) => {
      const currentUsername = identity.username;
      const { force, users } = input;
      const results = [];
      const toUpdateOrgUsers = [];
      const errors = [];
      console.log(users);

      const promises = users.map(async (user) => {
        const now = new Date().toISOString();
        console.log(user);
        const {
          username,
          organizationId,
          name,
          email,
          role: inRoleOrGroup,
          idNumber,
          groupId,
          password,
          isActive = 1,
        } = user;
        // check if user exists
        const existingUser = await getUser(username);
        console.log(`existingUser`, existingUser);

        if (!existingUser) {
          await createUser(username, name, email, password);
        } else {
          const userOrgId = (existingUser.UserAttributes.find(({ Name }) => Name === 'custom:organizationId') || {}).Value;
          if (!force && // app admin only
            password && // params for creation
            userOrgId && userOrgId !== organizationId // only allow to edit within the same organization
          ) {
            throw new Error(`${username} already exists`);
          }
        }

        const { name: organizationName } = await getOrganization(organizationId);
        const role = getRoleByGroup(inRoleOrGroup);
        const groupName = getGroupByRole(inRoleOrGroup);
        await Promise.all([
          addToGroup(username, groupName),
          updateAttributes(username, organizationId, organizationName, email),
        ]);

        const existingOrgUser = await getOrganizationUser(organizationId, username);
        if (!existingOrgUser) {
          toUpdateOrgUsers.push({
            __typename: 'OrganizationUser',
            organizationId,
            username,
            idNumber,
            name,
            email,
            role,
            groupId,
            isActive,
            currentPoints: 0,
            earnedPoints: 0,
            createdAt: now,
            createdBy: currentUsername,
            updatedAt: now,
            updatedBy: currentUsername,
          });
        } else {
          toUpdateOrgUsers.push(Object.assign(existingOrgUser, {
            email,
            name,
            idNumber,
            isActive,
            role,
            groupId: groupId || existingOrgUser.groupId,
            updatedAt: now,
            updatedBy: currentUsername,
          }));
        }

        results.push({
          organizationId,
          username,
        });
      });

      await Promise.all(promises);

      await updateOrganizationUsers(toUpdateOrgUsers);

      return {
        errors,
        organizationUsers: results,
      };
    },
  },
};

function getRoleByGroup(inGroup) {
  switch (inGroup) {
  case 'AppAdmins':
  case 'OrgAdmins':
  case '管理員':
  case 'Admin':
    return 'Admin';
  case 'OrgManagers':
  case '職員':
  case 'Manager':
    return 'Manager';
  case 'Users':
  case 'User':
  case 'N/A':
  case '學生':
  default:
    return 'User';
  }
}

function getGroupByRole(inRole) {
  switch (inRole) {
  case 'AppAdmins':
    return 'AppAdmins';
  case 'Admin':
  case 'OrgAdmins':
  case '管理員':
    return 'OrgAdmins';
  case 'Manager':
  case 'OrgManagers':
  case '職員':
    return 'OrgManagers';
  case 'User':
  case 'Users':
  case '學生':
  case 'PendingApproval':
  default:
    return 'Users';
  }
}
