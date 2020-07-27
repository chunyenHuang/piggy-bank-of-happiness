import React, { useState, useEffect } from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Input } from 'react-native-elements';
import { v1 as uuidv1 } from 'uuid';
import moment from 'moment';

import Colors from '../constants/Colors';
import request from '../src/utils/request';
import CustomModal from './CustomModal';
import { createOrganizationTransaction, updateOrganizationUser } from '../src/graphql/mutations';

export default function PointsHandler({ mode, user, onUpdate }) {
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [button, setButton] = useState({
    icon: 'md-card',
    title: '提取',
    color: Colors.raised,
  });

  const submit = async () => {
    setIsLoading(true);
    const { organizationId, username } = user;

    // pull the latest user record
    const { data: { getOrganizationUser: { currentPoints, earnedPoints } } } = await request( /* GraphQL */ `
          query GetOrganizationUser($organizationId: ID!, $username: String!) {
            getOrganizationUser(organizationId: $organizationId, username: $username) {
              currentPoints
              earnedPoints
            }
          }
        `, {
      organizationId,
      username,
    });

    const now = moment().toISOString();
    const points = parseFloat(amount) * 100;
    console.log({ points, note });

    if (mode === 'withdraw') {
      const transaction = {
        organizationId,
        id: uuidv1(),
        username,
        points: -points,
        type: 'withdraw',
        note,
        createdBy: await AsyncStorage.getItem('app:username'),
        createdAt: now,
        updatedAt: now,
      };
      const updatedUser = {
        organizationId,
        username,
        currentPoints: currentPoints - points,
        earnedPoints: earnedPoints - points,
        updatedAt: now,
      };

      await Promise.all([
        request(createOrganizationTransaction, { input: transaction }),
        request(updateOrganizationUser, { input: updatedUser }),
      ]);
    } else
    if (mode === 'adjustment') {
      const transaction = {
        organizationId,
        id: uuidv1(),
        username,
        points: points,
        type: 'adjustment',
        note,
        createdBy: await AsyncStorage.getItem('app:username'),
        createdAt: now,
        updatedAt: now,
      };
      const updatedUser = {
        organizationId,
        username,
        currentPoints: currentPoints + points,
        earnedPoints: earnedPoints + points,
        updatedAt: now,
      };

      await Promise.all([
        request(createOrganizationTransaction, { input: transaction }),
        request(updateOrganizationUser, { input: updatedUser }),
      ]);
    }

    onUpdate && onUpdate();
    setIsLoading(false);
    setVisible(false);
  };

  useEffect(() => {
    // reset
    if (visible) {
      setIsLoading(false);
      setAmount('');
      setNote('');
    }
  }, [visible]);

  useEffect(() => {
    let button;
    switch (mode) {
    case 'adjustment':
      button = {
        icon: 'md-sync',
        title: '調整',
        color: Colors.accent,
      };
      break;
    case 'withdraw':
    default:
      button = {
        icon: 'md-card',
        title: '提取',
        color: Colors.raised,
      };
    }
    setButton(button);
  }, [mode]);

  return (
    <View>
      <Button
        icon={
          <Icon
            name={button.icon}
            // size={15}
            type='ionicon'
            color={button.color}
            containerStyle={{ paddingRight: 10 }}
          />
        }
        type="clear"
        title={button.title}
        titleStyle={{ color: button.color }}
        onPress={()=>setVisible(true)}
      />

      <CustomModal
        title={button.title}
        visible={visible}
        onClose={()=>setVisible(false)}
        padding
        bottomButtonProps={{
          title: '確認',
          onPress: ()=> submit(),
          disabled: isLoading,
        }}
        bottomButtonStyle={{ backgroundColor: button.color }}
      >
        <Input
          label="點數"
          labelStyle={{ ...styles.inputLabel, paddingTop: 16 }}
          inputStyle={styles.input}
          placeholder='0.00'
          keyboardType="decimal-pad"
          autoFocus={true}
          value={amount}
          onChangeText={setAmount}
        />

        <Input
          label="備註"
          labelStyle={styles.inputLabel}
          placeholder='原因/用途...'
          multiline={true}
          numberOfLines={5}
          value={note}
          onChangeText={setNote}
        />
      </CustomModal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    textAlign: 'center',
    marginBottom: 32,
  },
  inputLabel: {
    textAlign: 'center',
  },
  input: {
    fontSize: 30,
    textAlign: 'center',
    padding: 16,
  },
});
