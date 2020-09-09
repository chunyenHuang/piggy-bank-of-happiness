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
          role,
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
        const groupName = getGroupByRole(role);
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

function getGroupByRole(inRole) {
  switch (inRole) {
  case 'Admin':
    return 'OrgAdmins';
  case 'Manager':
    return 'OrgManagers';
  case 'User':
  case 'PendingApproval':
  default:
    return 'Users';
  }
}
