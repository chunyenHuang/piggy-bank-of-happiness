import React, { useEffect, useState } from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { ListItem, Input, Icon } from 'react-native-elements';
import { Button } from 'react-native-paper';
import CustomModal from './CustomModal';

import Colors from '../constants/Colors';
import { currency, shortString, formatDatetime } from '../src/utils/format';
import request from '../src/utils/request';
import { adminUpdatePoint, updateOrganizationTransactionApplication } from '../src/graphql/mutations';
import { getPropsByStatus, getPropsByType } from 'constants/Transaction';

export default function TransactionApplicationListItem({ transaction: inData, mode = 'user', onUpdate }) {
  const [transaction, setTransaction] = useState(undefined);

  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState('');

  const update = async (status) => {
    setIsLoading(true);

    const currentUsername = await AsyncStorage.getItem('app:username');

    // create real transaction
    const {
      organizationId,
      username,
      transactionId,
      type,
      taskId,
      taskName,
      points,
      rewardId,
      rewardAmount,
      description,
    } = transaction;
    let action;
    switch (type) {
    case 'credits':
    case 'tasks':
      action = {
        transactionId,
        taskId,
        taskName,
        taskPoints: points,
      };
      break;
    case 'reward':
      action = {
        transactionId,
        rewardId,
        rewardAmount,
      };
      break;
    case 'withdraw':
      action = {
        transactionId,
        type,
        points,
        note: description,
      };
      break;
    }
    const pointPayload = {
      input: {
        organizationId,
        username,
        actions: [action],
      },
    };

    console.log(pointPayload);

    await request(adminUpdatePoint, pointPayload);

    const applicationPayload = {
      input: {
        id: transaction.id,
        status,
        note,
        updatedBy: currentUsername,
      },
    };

    await request(updateOrganizationTransactionApplication, applicationPayload);

    if (onUpdate) onUpdate();

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    setTransaction(inData);
    setNote(inData.note);
  }, [inData]);

  if (!transaction) return null;

  const {
    label,
    color,
    icon,
    iconType,
  } = getPropsByType(transaction.type);
  const {
    label: statusLabel,
  } = getPropsByStatus(transaction.status);
  const amount = currency(transaction.points);
  const date = formatDatetime(transaction.createdAt);

  return (
    <View style={styles.container}>
      <ListItem
        key={transaction.id}
        bottomDivider
        onPress={() => {
          if (mode === 'admin') {
            setVisible(true);
          }
        }}
      >
        <Icon
          name={icon}
          type={iconType}
          color={color}
          reverse
          size={15}
        />
        <ListItem.Content>
          {mode === 'user' && <ListItem.Title style={styles.title}>
            {label} ({statusLabel})
          </ListItem.Title>}
          {mode === 'admin' && <ListItem.Title style={styles.title}>
            {transaction.user.name} ({label})
          </ListItem.Title>}
          <React.Fragment>
            <ListItem.Subtitle style={styles.subtitle}>
              {shortString(transaction.description, 100)}
            </ListItem.Subtitle>
            <ListItem.Subtitle style={styles.subtitle}>
              {date}
            </ListItem.Subtitle>
          </React.Fragment>
        </ListItem.Content>
        <ListItem.Title style={{ ...styles.rightTitle, color }}>{amount}</ListItem.Title>
        {mode === 'admin' && <ListItem.Chevron />}
      </ListItem>
      <CustomModal
        title="申請細項"
        visible={visible}
        onClose={() => setVisible(false)}
        padding
        // bottomButtonProps={{
        //   title: `確認`,
        //   onPress: ()=> updateNote(),
        //   disabled: isLoading || !isDirty,
        // }}
      >
        <Input
          label="類別"
          value={label}
          disabled={true}
        />
        <Input
          label="日期"
          value={date}
          disabled={true}
        />
        <Input
          label="點數"
          value={amount}
          disabled={true}
        />
        <Input
          label="申請人"
          value={`${transaction.user.name} (${transaction.createdBy})`}
          disabled={true}
        />
        <Input
          label="用途"
          placeholder='用途'
          multiline={true}
          numberOfLines={5}
          value={transaction.description}
          disabled={true}
        />
        <Input
          label="備註"
          placeholder='...'
          multiline={true}
          numberOfLines={5}
          value={note}
          onChangeText={(value)=>{
            setNote(value);
          }}
          disabled={isLoading}
        />
        {transaction.status === 'Pending' &&
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Button
            color={Colors.error}
            dark={true}
            mode="contained"
            disabled={isLoading}
            onPress={() => update('Rejected')}
          >
            拒絕
          </Button>
          <View style={{ flex: 1 }} />
          <Button
            color={Colors.primary}
            dark={true}
            mode="contained"
            disabled={isLoading}
            onPress={() => update('Approved')}
          >
            批准
          </Button>
        </View>}
      </CustomModal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    margin: 20,
    textAlign: 'center',
    color: Colors.light,
  },
  subtitle: {
    color: Colors.light,
    marginTop: 5,
    fontSize: 12,
  },
  rightTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
