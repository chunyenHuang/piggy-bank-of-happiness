const {
  getOrganization,
  getOrganizationUser,
  updateOrganizationUsers,
} = require('./opt/ddb');

const {
  getUser,
  createUser,
  addToGroup,
  removeUserGroups,
  updateOrg,
} = require('./opt/cognito');

module.exports = {
  Mutation: {
    userOperation: async ({ arguments: { input } }) => {
      const { force, users } = input;
      const results = [];
      const toUpdateOrgUsers = [];
      const errors = [];
      console.log(users);

      const promises = users.map(async (user) => {
        const now = new Date().toISOString();
        let password;

        console.log(user);
        const {
          username,
          organizationId,
          name,
          email,
          role: inRoleOrGroup,
          idNumber,
          groupId,
        } = user;
        // check if user exists
        const existingUser = await getUser(username);
        console.log(`existingUser`, existingUser);

        if (!existingUser) {
          const user = await createUser(username, name, email);
          password = user.password;
        } else {
          const userOrgId = (existingUser.UserAttributes.find(({ Name }) => Name === 'custom:organizationId') || {}).Value;
          if (!force && userOrgId && userOrgId !== organizationId) {
            throw new Error(`${username} already exists`);
          } else {
            await removeUserGroups(username);
          }
        }

        const { name: organizationName } = await getOrganization(organizationId);
        const role = getRoleByGroup(inRoleOrGroup);
        const groupName = getGroupByRole(inRoleOrGroup);
        await Promise.all([
          addToGroup(username, groupName),
          updateOrg(username, organizationId, organizationName),
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
            isActive: 1,
            currentPoints: 0,
            earnedPoints: 0,
            createdAt: now,
            updatedAt: now,
          });
        } else {
          toUpdateOrgUsers.push(Object.assign(existingOrgUser, {
            email,
            role,
            groupId: groupId || existingOrgUser.groupId,
            updatedAt: now,
          }));
        }

        results.push({
          organizationId,
          username,
          password,
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
