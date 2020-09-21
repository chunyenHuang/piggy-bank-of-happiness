import React, { useState, useEffect } from 'react';
import { View, AsyncStorage } from 'react-native';
import { v1 as uuidv1 } from 'uuid';
import moment from 'moment';
import { Hub } from 'aws-amplify';

import request from '../src/utils/request';
import { updateOrganizationReward, createOrganizationTransaction, updateOrganizationUser } from '../src/graphql/mutations';
import RewardList from './RewardList';
import CustomModal from './CustomModal';
import Colors from 'constants/Colors';

export default function AddRewardToUser({ user, visible, onUpdate, onClose }) {
  const [isLoading, setIsLoading] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [summary, setSummary] = useState({});

  const handleSelect = (reward) => {
    const index = rewards.findIndex(({ id }) => id === reward.id);
    const matched = rewards[index];

    if (reward.amount > 0) {
      if (matched) {
        matched.amount = reward.amount;
      } else {
        rewards.push(reward);
      }
    } else {
      if (matched) {
        rewards.splice(index, 1);
      }
    }

    setRewards([...rewards]);

    let count = 0;
    let totalPoints = 0;
    rewards.forEach(({ amount, requiredPoints }) => {
      count += amount;
      totalPoints += (requiredPoints * amount) / 100;
    });

    setSummary({
      count,
      totalPoints,
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    Hub.dispatch('app', { event: 'loading' });

    const { organizationId, username } = user;

    // TODO: Optimize the process
    await rewards.reduce(async (chain, reward) => {
      await chain;

      console.log(reward);

      // pull the latest user record
      const { data: { getOrganizationUser: { currentPoints } } } = await request( /* GraphQL */ `
      query GetOrganizationUser($organizationId: ID!, $username: String!) {
        getOrganizationUser(organizationId: $organizationId, username: $username) {
          currentPoints
        }
      }
    `, {
        organizationId,
        username,
      });
      const { data: { getOrganizationReward: { total: rewardTotal } } } = await request( /* GraphQL */ `
      query GetOrganizationReward($organizationId: ID!, $id: ID!) {
        getOrganizationReward(organizationId: $organizationId, id: $id) {
          total
        }
      }
    `, {
        organizationId,
        id: reward.id,
      });
      global.logger.debug({ rewardTotal });

      const currentUsername = await AsyncStorage.getItem('app:username');

      // For now, assign and complete the task immediately and then create the transaction for user
      const transactionId = uuidv1();
      const amount = reward.amount;
      const points = reward.requiredPoints * amount;
      const now = moment().toISOString();
      const transaction = {
        organizationId,
        id: transactionId,
        rewardId: reward.id,
        username,
        points: -points,
        type: 'reward',
        note: `${reward.name} 點數 ${reward.requiredPoints / 100} x 數量 ${amount}`,
        createdBy: currentUsername,
        createdAt: now,
        updatedBy: currentUsername,
        updatedAt: now,
      };
      const updatedUser = {
        organizationId,
        username,
        currentPoints: currentPoints - points,
        updatedBy: currentUsername,
        updatedAt: now,
      };
      const toUpdateReward = {
        organizationId,
        id: reward.id,
        total: rewardTotal - amount,
        updatedBy: currentUsername,
        updatedAt: now,
      };
      await Promise.all([
        request(updateOrganizationReward, { input: toUpdateReward }),
        request(createOrganizationTransaction, { input: transaction }),
        request(updateOrganizationUser, { input: updatedUser }),
      ]);
    }, Promise.resolve());

    Hub.dispatch('app', { event: 'loading-complete' });
    setIsLoading(false);
    onUpdate && onUpdate();
    onClose && onClose();
  };

  useEffect(() => {
    if (visible) {
      setRewards([]);
      setSummary({ count: 0, totalPoints: 0 });
    }
  }, [visible]);

  return (
    <View>
      <CustomModal
        title="兌換獎品"
        visible={visible}
        onClose={() => onClose && onClose()}
        bottomButtonProps={{
          title: `${summary.count} 獎品 ${summary.totalPoints} 點 確認`,
          onPress: ()=> handleSubmit(),
          disabled: summary.count === 0 || isLoading,
        }}
        bottomButtonStyle={{ backgroundColor: Colors.accent }}
      >
        <RewardList
          mode="select"
          onSelect={handleSelect}
          disabled={isLoading}
        />
      </CustomModal>
    </View>
  );
}
