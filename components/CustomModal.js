import React from 'react';
import { StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { Button } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function CustomModal({
  visible,
  children,
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
      onBackdropPress={onClose}
      style={styles.modal}
    >
      {/* TODO: close button */}
      <KeyboardAwareScrollView
        style={{ ...styles.modalContainer, ...containerStyle, padding: (padding ? 24:0) }}
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
    marginTop: 100,
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    height: 80,
  },
});
