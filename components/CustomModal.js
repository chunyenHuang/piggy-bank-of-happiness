import React from 'react';
import { View, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { Button, Icon, Text } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { isIphoneX } from '../src/utils/device';

export default function CustomModal({
  visible,
  children,
  title = '',
  padding = false,
  containerStyle = {},
  onClose,
  actionsComponent,
  bottomButtonProps,
  bottomButtonStyle = {},
}) {
  return (
    <Modal
      isVisible={visible}
      hardwareAccelerated
      onBackdropPress={() => {}}
      style={styles.modal}
    >
      <View style={{ height: 50 }} flexDirection="row" justifyContent="center" alignItems="center">
        <Text style={{ fontSize: 20 }}>{title}</Text>
        <Icon
          name="md-close"
          size={30}
          type='ionicon'
          containerStyle={{ position: 'absolute', top: 12, right: 24 }}
          onPress={onClose}
        />
      </View>
      {/* TODO: close button */}
      <KeyboardAwareScrollView
        style={{ ...styles.modalContainer, ...containerStyle, padding: 12, paddingTop: 0 }}
        scrollEnabled={true}
        enableAutomaticScroll={true}
        alwaysBounceVertical={false}
        // extraHeight={50}
        // extraScrollHeight={50}
      >
        {children}
      </KeyboardAwareScrollView>
      {actionsComponent}
      {bottomButtonProps &&
        <Button
          buttonStyle={{ ...styles.button, ...bottomButtonStyle }}
          {...bottomButtonProps}
        />
      }
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    margin: 0,
    marginTop: isIphoneX ? 50 : 30,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  button: {
    height: isIphoneX ? 100 : 60,
  },
});
