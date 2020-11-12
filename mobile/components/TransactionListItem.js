import React, { useEffect, useState } from 'react';
import { StyleSheet, View, AsyncStorage, Alert } from 'react-native';
import { ListItem, Input, Icon } from 'react-native-elements';
import moment from 'moment';
import { Button } from 'react-native-paper';
import { v1 as uuidv1 } from 'uuid';
import CustomModal from './CustomModal';

import Colors from '../constants/Colors';
import { currency, shortString } from '../src/utils/format';
import request from '../src/utils/request';
import { createOrganizationTransaction, updateOrganizationUser, updateOrganizationTransaction } from '../src/graphql/mutations';
import check from '../src/permission/check';
import { getPropsByType } from 'constants/Transaction';

export default function TransactionListItem({ transaction: inData, onUpdate }) {
  const [transaction, setTransaction] = useState(undefined);

  const [visible, setVisible] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [note, setNote] = useState('');

  const cancel = async ({ points, id, organizationId, username, note }) => {
    setIsLoading(true);
    // Create a new tx to balance the current transaction

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

    const currentUsername = await AsyncStorage.getItem('app:username');
    const now = moment().toISOString();
    const transaction = {
      organizationId,
      id: uuidv1(),
      refTransactionId: id,
      username,
      points: -points,
      type: 'cancel',
      note: `取消 ${note}`,
      createdBy: currentUsername,
      createdAt: now,
      updatedBy: currentUsername,
      updatedAt: now,
    };
    const updatedTransaction = {
      organizationId,
      id,
      isCancelled: 1,
      updatedBy: currentUsername,
      updatedAt: now,
    };
    const updatedUser = {
      organizationId,
      username,
      currentPoints: currentPoints - points,
      earnedPoints: earnedPoints - points,
      updatedBy: currentUsername,
      updatedAt: now,
    };

    await Promise.all([
      request(updateOrganizationTransaction, { input: updatedTransaction }),
      request(createOrganizationTransaction, { input: transaction }),
      request(updateOrganizationUser, { input: updatedUser }),
    ]);

    setIsLoading(false);
    setVisible(false);
    onUpdate && onUpdate();
  };

  const updateNote = async () => {
    if (!await check('ORG_TX__UPDATE', true)) return;
    setIsLoading(true);
    const { id, organizationId } = transaction;

    const currentUsername = await AsyncStorage.getItem('app:username');

    const updatedTransaction = {
      organizationId,
      id,
      note,
      updatedBy: currentUsername,
      updatedAt: moment().toISOString(),
    };
    await request(updateOrganizationTransaction, { input: updatedTransaction });

    setVisible(false);

    onUpdate && onUpdate();
    setIsLoading(false);
  };

  useEffect(() => {
    if (visible) {
      setIsDirty(false);
    }
  }, [visible]);

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
  const amount = currency(transaction.points);
  const date = moment(transaction.createdAt).format('MM/DD/YYYY hh:mm');

  return (
    <View style={styles.container}>
      <ListItem
        key={transaction.id}
        bottomDivider
        onPress={() => setVisible(true)}
      >
        <Icon
          name={icon}
          type={iconType}
          color={color}
          reverse
          size={15}
        />
        <ListItem.Content>
          <ListItem.Title style={styles.title}>{transaction.note ? shortString(transaction.note, 50) : transaction.type}</ListItem.Title>
          <ListItem.Subtitle style={styles.subtitle}>{`${date} 經手人 ${transaction.createdBy}`}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Title style={{ ...styles.rightTitle, color }}>{amount}</ListItem.Title>
        <ListItem.Chevron />
      </ListItem>
      <CustomModal
        title="交易紀錄"
        visible={visible}
        onClose={() => setVisible(false)}
        padding
        bottomButtonProps={{
          title: `確認`,
          onPress: ()=> updateNote(),
          disabled: isLoading || !isDirty,
        }}
      >
        <View style={styles.headerContainer}>
          {transaction.type !== 'cancel' &&
           transaction.type !== 'reward' &&
           !transaction.isCancelled &&
          <Button
            color={Colors.error}
            compact={true}
            onPress={async ()=> {
              if (!await check('ORG_TX__CANCEL', true)) return;

              Alert.alert(
                '取消交易亦會修正使用者餘額',
                '',
                [
                  {
                    text: '放棄',
                    onPress: () => {},
                    style: 'cancel',
                  },
                  { text: '確認取消交易', onPress: () => cancel(transaction) },
                ],
                { cancelable: false },
              );
            }}
            disabled={isLoading}
          >
            取消交易
          </Button>}
        </View>
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
          label="經手人"
          value={transaction.createdBy}
          disabled={true}
        />
        <Input
          label="備註"
          placeholder='原因/用途...'
          multiline={true}
          numberOfLines={5}
          value={note}
          onChangeText={(value)=>{
            setIsDirty(true);
            setNote(value);
          }}
          disabled={isLoading}
        />
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
