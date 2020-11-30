import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Hub } from 'aws-amplify';
import { v1 as uuidv1 } from 'uuid';

import request from '../src/utils/request';
import { adminUpdatePoint, createOrganizationTransactionApplication } from '../src/graphql/mutations';
import RewardList from './RewardList';
import CustomModal from './CustomModal';
import Colors from 'constants/Colors';

export default function AddRewardToUser({ user, isApplication = false, visible, onUpdate, onClose }) {
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
    console.log(rewards);

    if (isApplication) {
      await Promise.all(rewards.map(async (reward) => {
        const { requiredPoints, id, amount, name } = reward;

        const payload = {
          input: {
            organizationId,
            username,
            status: 'Pending',
            type: 'reward',
            transactionId: uuidv1(),
            rewardId: id,
            rewardAmount: amount,
            points: -(requiredPoints * amount),
            description: `${name} 點數 ${requiredPoints / 100} x 數量 ${amount}`,
            createdBy: username,
            updatedBy: username,
          },
        };

        await request(createOrganizationTransactionApplication, payload);
      }));
    } else {
      const payload = {
        input: {
          organizationId,
          username,
          actions: rewards.map(({ id, amount }) => {
            return {
              rewardId: id,
              rewardAmount: amount,
            };
          }),
        },
      };

      console.log(payload);

      await request(adminUpdatePoint, payload);
    }

    Hub.dispatch('app', { event: 'loading-complete' });
    setIsLoading(false);
    if (onUpdate) onUpdate();
    if (onClose) onClose();
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
