import React, { useState } from 'react';
import { StyleSheet, View, AsyncStorage } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import Modal from 'react-native-modal';
import { ScrollView } from 'react-native-gesture-handler';

import Colors from '../constants/Colors';

export default function WithdrawPointsForUser({ user, onUpdate }) {
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <Button
        icon={
          <Icon
            name="md-card"
            // size={15}
            type='ionicon'
            color={Colors.raised}
            containerStyle={{ paddingRight: 10 }}
          />
        }
        type="clear"
        title="提取點數"
        titleStyle={{ color: Colors.raised }}
        onPress={()=>{}}
      />

      <Modal
        isVisible={visible}
        hardwareAccelerated
        onBackdropPress={()=>setVisible(false)}
      >
        <ScrollView style={styles.modal}>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
