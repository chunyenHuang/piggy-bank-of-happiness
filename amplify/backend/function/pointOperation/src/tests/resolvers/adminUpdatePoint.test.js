const adminUpdatePoint = require('../../resolvers/adminUpdatePoint');
const db = require('../../lib/db');

jest.mock('../../lib/db');

const TEST_ADMIN_USERNAME = 'test-admin';
const TEST_ORG_ID = 'test-org-id';
const TEST_USERNAME = 'test-user-name';

describe('adminUpdatePoint', () => {
  test('Add Task to user', async () => {
    db.getOrgUser.mockImplementation(async () => {
      return {
        currentPoints: 0,
        earnedPoints: 0,
      };
    });

    db.updateOrgUser.mockImplementation(async (items) => {
      expect(items.length).toEqual(1);
      const { currentPoints, earnedPoints } = items[0];
      expect(currentPoints).toEqual(1000);
      expect(earnedPoints).toEqual(1000);
    });

    db.updateOrgUserTask.mockImplementation(async (items) => {
      expect(items.length).toEqual(1);
      const { status, points } = items[0];
      expect(status).toEqual('Completed');
      expect(points).toEqual(1000);
    });

    db.updateOrgTransaction.mockImplementation(async (items) => {
      expect(items.length).toEqual(1);
      const { type, points } = items[0];
      expect(type).toEqual('credits');
      expect(points).toEqual(1000);
    });

    db.updateOrgReward.mockImplementation(async (items) => {
      expect(items.length).toEqual(0);
    });

    const payload = {
      identity: TEST_ADMIN_USERNAME,
      arguments: {
        input: {
          organizationId: TEST_ORG_ID,
          username: TEST_USERNAME,
          actions: [{
            taskId: 'task-1',
            taskName: 'task-name',
            taskPoints: 1000,
          }],
        },
      },
    };

    const { message } = await adminUpdatePoint(payload);
    expect(message).toEqual('success');
  });

  test('Add Reward to user', async () => {
    db.getOrgUser.mockImplementation(async () => {
      return {
        currentPoints: 10000,
        earnedPoints: 10000,
      };
    });

    db.getOrgReward.mockImplementation(async () => {
      return {
        name: 'test-reward',
        total: 1000,
        requiredPoints: 800,
      };
    });

    db.updateOrgUser.mockImplementation(async (items) => {
      expect(items.length).toEqual(1);
      const { currentPoints, earnedPoints } = items[0];
      expect(currentPoints).toEqual(3600);
      expect(earnedPoints).toEqual(10000);
    });

    db.updateOrgUserTask.mockImplementation(async (items) => {
      expect(items.length).toEqual(0);
    });

    db.updateOrgTransaction.mockImplementation(async (items) => {
      expect(items.length).toEqual(1);
      const { type, points } = items[0];
      expect(type).toEqual('reward');
      expect(points).toEqual(-6400);
    });

    db.updateOrgReward.mockImplementation(async (items) => {
      expect(items.length).toEqual(1);
      const { total } = items[0];
      expect(total).toEqual(992);
    });

    const payload = {
      identity: TEST_ADMIN_USERNAME,
      arguments: {
        input: {
          organizationId: TEST_ORG_ID,
          username: TEST_USERNAME,
          actions: [{
            rewardId: 'reward-1',
            rewardAmount: 8,
          }],
        },
      },
    };

    const { message } = await adminUpdatePoint(payload);
    expect(message).toEqual('success');
  });

  test('Adjustment (add points to user manually)', async () => {
    db.getOrgUser.mockImplementation(async () => {
      return {
        currentPoints: 0,
        earnedPoints: 0,
      };
    });

    db.updateOrgUser.mockImplementation(async (items) => {
      expect(items.length).toEqual(1);
      const { currentPoints, earnedPoints } = items[0];
      expect(currentPoints).toEqual(666);
      expect(earnedPoints).toEqual(666);
    });

    db.updateOrgUserTask.mockImplementation(async (items) => {
      expect(items.length).toEqual(0);
    });

    db.updateOrgTransaction.mockImplementation(async (items) => {
      expect(items.length).toEqual(1);
      const { type, points } = items[0];
      expect(type).toEqual('adjustment');
      expect(points).toEqual(666);
    });

    db.updateOrgReward.mockImplementation(async (items) => {
      expect(items.length).toEqual(0);
    });

    const payload = {
      identity: TEST_ADMIN_USERNAME,
      arguments: {
        input: {
          organizationId: TEST_ORG_ID,
          username: TEST_USERNAME,
          actions: [{
            type: 'adjustment',
            points: 666,
            note: 'Manual Update',
          }],
        },
      },
    };

    const { message } = await adminUpdatePoint(payload);
    expect(message).toEqual('success');
  });

  test('Withdraw', async () => {
    db.getOrgUser.mockImplementation(async () => {
      return {
        currentPoints: 1000,
        earnedPoints: 1000,
      };
    });

    db.updateOrgUser.mockImplementation(async (items) => {
      expect(items.length).toEqual(1);
      const { currentPoints, earnedPoints } = items[0];
      expect(currentPoints).toEqual(334);
      expect(earnedPoints).toEqual(1000);
    });

    db.updateOrgUserTask.mockImplementation(async (items) => {
      expect(items.length).toEqual(0);
    });

    db.updateOrgTransaction.mockImplementation(async (items) => {
      expect(items.length).toEqual(1);
      const { type, points } = items[0];
      expect(type).toEqual('withdraw');
      expect(points).toEqual(-666);
    });

    db.updateOrgReward.mockImplementation(async (items) => {
      expect(items.length).toEqual(0);
    });

    const payload = {
      identity: TEST_ADMIN_USERNAME,
      arguments: {
        input: {
          organizationId: TEST_ORG_ID,
          username: TEST_USERNAME,
          actions: [{
            type: 'withdraw',
            points: 666,
            note: 'Manual Update',
          }],
        },
      },
    };

    const { message } = await adminUpdatePoint(payload);
    expect(message).toEqual('success');
  });

  test('Cancel Task Tx', async () => {
    db.getOrgUser.mockImplementation(async () => {
      return {
        currentPoints: 1000,
        earnedPoints: 1000,
      };
    });

    db.getOrgTransaction.mockImplementation(async () => {
      return {
        type :'credits',
        points: 1000,
      };
    });

    db.updateOrgUser.mockImplementation(async (items) => {
      expect(items.length).toEqual(1);
      const { currentPoints, earnedPoints } = items[0];
      expect(currentPoints).toEqual(0);
      expect(earnedPoints).toEqual(0);
    });

    db.updateOrgUserTask.mockImplementation(async (items) => {
      expect(items.length).toEqual(0);
    });

    db.updateOrgTransaction.mockImplementation(async (items) => {
      expect(items.length).toEqual(2);
      items.forEach((item) => {
        if (item.type === 'cancel') {
          expect(item.points).toEqual(-1000);
        } else {
          expect(item.points).toEqual(1000);
          expect(item.isCancelled).toEqual(1);
        }
      });
    });

    db.updateOrgReward.mockImplementation(async (items) => {
      expect(items.length).toEqual(0);
    });

    const payload = {
      identity: TEST_ADMIN_USERNAME,
      arguments: {
        input: {
          organizationId: TEST_ORG_ID,
          username: TEST_USERNAME,
          actions: [{
            type: 'cancel',
            refTransactionId: 'ref-tx-id',
          }],
        },
      },
    };

    const { message } = await adminUpdatePoint(payload);
    expect(message).toEqual('success');
  });

  test('Cancel withdraw', async () => {
    db.getOrgUser.mockImplementation(async () => {
      return {
        currentPoints: 0,
        earnedPoints: 1000,
      };
    });

    db.getOrgTransaction.mockImplementation(async () => {
      return {
        type: 'withdraw',
        points: -1000,
      };
    });

    db.updateOrgUser.mockImplementation(async (items) => {
      expect(items.length).toEqual(1);
      const { currentPoints, earnedPoints } = items[0];
      expect(currentPoints).toEqual(1000);
      expect(earnedPoints).toEqual(1000);
    });

    db.updateOrgUserTask.mockImplementation(async (items) => {
      expect(items.length).toEqual(0);
    });

    db.updateOrgTransaction.mockImplementation(async (items) => {
      expect(items.length).toEqual(2);
      items.forEach((item) => {
        if (item.type === 'cancel') {
          expect(item.points).toEqual(1000);
        } else {
          expect(item.points).toEqual(-1000);
          expect(item.isCancelled).toEqual(1);
        }
      });
    });

    db.updateOrgReward.mockImplementation(async (items) => {
      expect(items.length).toEqual(0);
    });

    const payload = {
      identity: TEST_ADMIN_USERNAME,
      arguments: {
        input: {
          organizationId: TEST_ORG_ID,
          username: TEST_USERNAME,
          actions: [{
            type: 'cancel',
            refTransactionId: 'ref-tx-id',
          }],
        },
      },
    };

    const { message } = await adminUpdatePoint(payload);
    expect(message).toEqual('success');
  });
});
