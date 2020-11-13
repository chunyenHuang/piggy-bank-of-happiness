const moment = require('moment');
const { v1: uuidv1 } = require('uuid');

const {
  getOrgUser,
  getOrgReward,
  getOrgTransaction,
  updateOrgUser,
  updateOrgUserTask,
  updateOrgTransaction,
  updateOrgReward,
} = require('../lib/db');

/**
 * Admin Update Point Actions
 * 1. AddTaskToUser
 * 2. AddRewardToUser
 */

module.exports = async ({
  arguments: { input },
  identity,
}) => {
  console.log(JSON.stringify({ input, identity }));
  const currentUsername = identity.username;
  const { organizationId, username, actions } = input;

  const now = moment().toISOString();
  const user = await getOrgUser(organizationId, username);
  const { currentPoints, earnedPoints } = user;

  console.log({ currentPoints, earnedPoints });

  const errors = [];
  let toUpdatePoints = 0;
  let toUpdateEarnedPoints = 0;
  const toUpdateUsers = [];
  const toCreateUserTasks = [];
  const toCreateTransactions = [];
  const toUpdateTransactions = [];
  const toUpdateRewards = [];

  const checkPromises = actions.map(async (action) => {
    const {
      taskId,
      taskName,
      taskPoints,
      rewardId,
      rewardAmount,
      points,
      type,
      note,
      refTransactionId,
    } = action;
    const transactionId = uuidv1();

    if (taskId && taskName && taskPoints) {
      toUpdatePoints += taskPoints;
      toUpdateEarnedPoints += taskPoints;

      const userTask = {
        __typename: 'OrganizationUserTask',
        organizationId,
        id: uuidv1(),
        taskId,
        taskName,
        username,
        status: 'Completed',
        note: 'N/A',
        transactionId,
        points: taskPoints,
        createdAt: now,
        createdBy: currentUsername,
        updatedAt: now,
        updatedBy: currentUsername,
      };

      toCreateUserTasks.push(userTask);

      const transaction = {
        __typename: 'OrganizationTransaction',
        organizationId,
        id: transactionId,
        username,
        points: taskPoints,
        type: 'credits',
        note: taskName,
        createdAt: now,
        createdBy: currentUsername,
        updatedAt: now,
        updatedBy: currentUsername,
      };

      toCreateTransactions.push(transaction);
    } else
    if (rewardId && rewardAmount) {
      const reward = await getOrgReward(organizationId, rewardId);
      const {
        name,
        requiredPoints,
        total,
      } = reward;

      const calculatedPoints = requiredPoints * rewardAmount;
      toUpdatePoints -= calculatedPoints;

      const updatedReward = Object.assign(reward, {
        total: total - rewardAmount,
        updatedBy: currentUsername,
        updatedAt: now,
      });
      toUpdateRewards.push(updatedReward);

      const transaction = {
        __typename: 'OrganizationTransaction',
        organizationId,
        id: transactionId,
        rewardId,
        username,
        points: -calculatedPoints,
        type: 'reward',
        note: `${name} 點數 ${requiredPoints / 100} x 數量 ${rewardAmount}`,
        createdBy: currentUsername,
        createdAt: now,
        updatedBy: currentUsername,
        updatedAt: now,
      };
      toCreateTransactions.push(transaction);
    } else
    if (type && points) {
      let calculatedPoints = points;

      if (type === 'cancel' && refTransactionId) {
        const refTransaction = await getOrgTransaction(organizationId, refTransactionId);
        const updateRefTransaction = Object.assign(refTransaction, {
          isCancelled: 1,
          updatedBy: currentUsername,
          updatedAt: now,
        });

        toUpdateTransactions.push(updateRefTransaction);

        calculatedPoints = -refTransaction.points;
        toUpdatePoints += calculatedPoints;
        toUpdateEarnedPoints += calculatedPoints;
      }

      switch (type) {
      case 'cancel':
        break;
      case 'withdraw':
        calculatedPoints = -Math.abs(calculatedPoints);
        toUpdatePoints += calculatedPoints;
        break;
      default:
        calculatedPoints = Math.abs(calculatedPoints);
        toUpdatePoints += calculatedPoints;
        toUpdateEarnedPoints += calculatedPoints;
      }

      const transaction = {
        __typename: 'OrganizationTransaction',
        organizationId,
        id: transactionId,
        username,
        points: calculatedPoints,
        type,
        note,
        createdBy: currentUsername,
        createdAt: now,
        updatedBy: currentUsername,
        updatedAt: now,
      };
      toCreateTransactions.push(transaction);
    }
  });

  await Promise.all(checkPromises);

  if (toUpdatePoints !== 0 || toUpdateEarnedPoints !== 0) {
    // TODO: check if the new balance will be less than 0
    const updatedUser = Object.assign(user, {
      currentPoints: currentPoints + toUpdatePoints,
      earnedPoints: earnedPoints + toUpdateEarnedPoints,
      updatedAt: now,
      updatedBy: currentUsername,
    });
    toUpdateUsers.push(updatedUser);
  }

  console.log({
    toUpdateUsers,
    toCreateUserTasks,
    toCreateTransactions,
    toUpdateTransactions,
    toUpdateRewards,
  });

  if (errors.length > 0) {
    return {
      message: 'failed',
      errors,
    };
  }

  try {
    await Promise.all([
      updateOrgUser(toUpdateUsers),
      updateOrgUserTask(toCreateUserTasks),
      updateOrgTransaction([...toCreateTransactions, ...toUpdateTransactions]),
      updateOrgReward(toUpdateRewards),
    ]);
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }

  return {
    message: 'success',
    errors,
  };
};
