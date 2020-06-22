import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, AsyncStorage, Alert } from 'react-native';
import { ListItem, Text, Input } from 'react-native-elements';
import moment from 'moment';
import Modal from 'react-native-modal';
import { Button } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { v1 as uuidv1 } from 'uuid';

import Colors from '../constants/Colors';
import { currency, shortString } from '../src/utils/format';
import request from '../src/utils/request';
import { createOrganizationTransaction, updateOrganizationUser, updateOrganizationTransaction } from '../src/graphql/mutations';

const deviceHeight = Platform.OS === 'ios' ?
  Dimensions.get('window').height :
  require('react-native-extra-dimensions-android').get('REAL_WINDOW_HEIGHT');

export default function TransactionListItem({ transaction: inData, onUpdate }) {
  const [transaction, setTransaction] = useState(undefined);

  const [visible, setVisible] = useState(false);
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

    const now = moment().toISOString();
    const transaction = {
      organizationId,
      id: uuidv1(),
      refTransactionId: id,
      username,
      points: -points,
      type: 'cancel',
      note: `取消 ${note}`,
      createdBy: await AsyncStorage.getItem('app:username'),
      createdAt: now,
      updatedAt: now,
    };
    const updatedTransaction = {
      organizationId,
      id,
      isCancelled: 1,
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
      request(updateOrganizationTransaction, { input: updatedTransaction }),
      request(createOrganizationTransaction, { input: transaction }),
      request(updateOrganizationUser, { input: updatedUser }),
    ]);

    setIsLoading(false);
    setVisible(false);
    onUpdate && onUpdate();
  };

  const updateNote = async () => {
    setIsLoading(true);
    const { id, organizationId } = transaction;

    const updatedTransaction = {
      organizationId,
      id,
      note,
      updatedAt: moment().toISOString(),
    };
    await request(updateOrganizationTransaction, { input: updatedTransaction });

    setVisible(false);

    onUpdate && onUpdate();
    setIsLoading(false);
  };

  useEffect(() => {
    setTransaction(inData);
    setNote(inData.note);
  }, [inData]);

  if (!transaction) return null;

  const color = getTypeColor(transaction.type);
  const amount = currency(transaction.points);
  const date = moment(transaction.updatedAt).format('MM/DD/YYYY hh:mm');

  return (
    <View style={styles.container}>
      <ListItem
        key={transaction.id}
        title={shortString(transaction.note, 50)}
        titleStyle={styles.title}
        subtitle={`${date} 經手人 ${transaction.createdBy}`}
        subtitleStyle={styles.subtitle}
        bottomDivider
        rightTitle={amount}
        rightTitleStyle={{ ...styles.rightTitle, color }}
        onPress={() => setVisible(true)}
        chevron
      />
      <Modal
        isVisible={visible}
        hardwareAccelerated
        onBackdropPress={()=>setVisible(false)}
        style={styles.modal}
      >
        <KeyboardAwareScrollView
          style={styles.modalContainer}
          scrollEnabled={true}
          enableAutomaticScroll={true}
          alwaysBounceVertical={false}
          extraHeight={150}
          extraScrollHeight={150}
        >
          <View style={styles.headerContainer}>
            <Text style={{ color }}>{getTypeName(transaction.type)}紀錄</Text>
            {transaction.type !== 'cancel' && !transaction.isCancelled &&
            <Button
              color={Colors.error}
              onPress={()=> {
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
            label="日期"
            value={date}
            disabled={true}
          />
          <Input
            label="金額"
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
            onChangeText={setNote}
            disabled={isLoading}
          />
          <Button
            onPress={updateNote}
            color={Colors.primary}
            mode="contained"
            disabled={isLoading}
          >
            更新備註
          </Button>
        </KeyboardAwareScrollView>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  modal: {
    flex: 1,
    margin: 0,
    marginTop: deviceHeight / 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 32,
  },
});

const getTypeColor = (type) => {
  switch (type) {
  case 'withdraw':
    return Colors.error;
  case 'cancel':
    return Colors.accent;
  case 'credits':
  default:
    return Colors.focused;
  }
};

const getTypeName = (type) => {
  switch (type) {
  case 'withdraw':
    return '提款';
  case 'cancel':
    return '取消';
  case 'credits':
  default:
    return '新增';
  }
};
