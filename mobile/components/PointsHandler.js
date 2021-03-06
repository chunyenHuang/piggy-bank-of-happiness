import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input } from 'react-native-elements';
import { Hub } from 'aws-amplify';
import { v1 as uuidv1 } from 'uuid';

import Colors from '../constants/Colors';
import request from '../src/utils/request';
import CustomModal from './CustomModal';
import {
  adminUpdatePoint,
  createOrganizationTransactionApplication,
} from 'src/graphql/mutations';

export default function PointsHandler({
  mode,
  isApplication,
  user,
  onUpdate,
  visible: inVisible,
  onClose,
}) {
  const [visible, setVisible] = useState(!!inVisible);
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

    const points = parseFloat(amount) * 100;

    if (isApplication) {
      const calculatedPoints = mode === 'withdraw' ? -points : points;

      const payload = {
        input: {
          organizationId,
          username,
          status: 'Pending',
          type: mode,
          transactionId: uuidv1(),
          points: calculatedPoints,
          description: note,
          createdBy: username,
          updatedBy: username,
        },
      };

      await request(createOrganizationTransactionApplication, payload);
    } else {
      const payload = {
        input: {
          organizationId,
          username,
          actions: [{
            type: mode,
            points,
            note,
          }],
        },
      };

      console.log(payload);

      await request(adminUpdatePoint, payload);
    }

    if (onUpdate) {
      onUpdate();
    } else {
      Hub.dispatch('user', { event: 'reload' });
    }
    if (onClose) onClose();
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
    if (inVisible) {
      setIsLoading(false);
      setAmount('');
      setNote('');
      setVisible(inVisible);
    }
  }, [inVisible]);

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
      <CustomModal
        title={button.title}
        visible={visible}
        onClose={ () => {
          setVisible(false);
          if (onClose) onClose();
        }}
        padding
        bottomButtonProps={{
          title: '確認',
          onPress: ()=> submit(),
          disabled: isLoading || note === '' || amount === '',
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
          onChangeText={(e)=>{
            if (!isNaN(e)) {
              setAmount(e);
            }
          }}
          errorStyle={{ color: 'red' }}
          errorMessage={''}
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
