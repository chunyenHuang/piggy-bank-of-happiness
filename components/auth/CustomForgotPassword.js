import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  Text,
} from 'react-native';
import {
  TextInput,
  Button,
} from 'react-native-paper';
import { Auth } from 'aws-amplify';
import Spinner from 'react-native-loading-spinner-overlay';

import { errorAlert } from '../../src/utils/alert';

let secondTextInput = null;

export default function CustomSignIn({ authState, onStateChange }) {
  const [username, setUsername] = useState('');
  const [isSettingNewPassword, setIsSettingNewPassword] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setUsername('');
    setIsSettingNewPassword(false);
    setMaskedEmail('');
    setNewPassword('');
    setNewPassword('');
    setCode('');
  }, [authState]);

  const goto = (state) => {
    onStateChange && onStateChange(state, {});
  };

  const submit = async () => {
    setIsSubmitting(true);

    try {
      const { CodeDeliveryDetails: { Destination } } = await Auth.forgotPassword(username);
      setMaskedEmail(Destination);
      setIsSettingNewPassword(true);
      // goto('signedIn');
    } catch (err) {
      errorAlert(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitNewPassword = async () => {
    setIsSubmitting(true);
    try {
      await Auth.forgotPasswordSubmit(
        username,
        code,
        newPassword,
      );
      await Auth.signIn(username, newPassword);
      goto('signedIn');
    } catch (err) {
      errorAlert(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authState !== 'forgotPassword') return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      enabled
      style={styles.container}
    >
      <Spinner
        visible={isSubmitting}
        textContent={''}
        textStyle={{ color: '#FFF' }}
      />
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={Keyboard.dismiss}
        accessible={false}>
        <View style={styles.scrollContainer}>
          <Text style={styles.header}>
            忘記密碼
          </Text>
          {!isSettingNewPassword &&
          <TextInput
            label="帳號"
            mode="outlined"
            // autoFocus={true}
            disabled={isSettingNewPassword}
            autoCompleteType={'email'}
            keyboardType="email-address"
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            autoCapitalize={'none'}
            returnKeyType={'send'}
            onSubmitEditing={submit}
          />}
          {!isSettingNewPassword &&
          <Button
            mode="contained"
            style={{ ...styles.button }}
            disabled={!username || isSubmitting}
            onPress={submit}>
            寄出授權碼
          </Button>}

          {isSettingNewPassword &&
          <Text style={styles.hint}>
            授權碼已寄至您的信箱 {maskedEmail}
          </Text>}

          {isSettingNewPassword &&
          <TextInput
            label='授權碼'
            mode="outlined"
            style={styles.input}
            onChangeText={(value)=>{
              setCode(value);
            }}
            value={code}
            autoCapitalize={'none'}
            returnKeyType={'next'}
            onSubmitEditing={()=> secondTextInput.focus()}
          />}

          {isSettingNewPassword &&
          <TextInput
            label='新密碼'
            mode="outlined"
            ref={(input) => secondTextInput = input}
            autoCompleteType={'password'}
            secureTextEntry={true}
            style={styles.input}
            onChangeText={(value)=>{
              setNewPassword(value);
            }}
            value={newPassword}
            autoCapitalize={'none'}
            returnKeyType={'go'}
            onSubmitEditing={submitNewPassword}
            enablesReturnKeyAutomatically={true}
          />}

          {isSettingNewPassword &&
          <Button
            mode="contained"
            style={{ ...styles.button }}
            disabled={!username || !newPassword || !code || isSubmitting}
            onPress={submitNewPassword}>
            重設密碼
          </Button>}

          <Button
            style={styles.textButton}
            onPress={()=>goto('signIn')}>
            回到登入頁面
          </Button>
        </View>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    marginTop: -50,
    marginBottom: -50,
    paddingTop: 50,
    paddingBottom: 50,
    // backgroundColor: Colors.primary,
  },
  scrollContainer: {
    flex: 1,
    padding: 32,
    width: '100%',
  },
  header: {
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 30,
    fontSize: 20,
  },
  hint: {
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 30,
  },
  input: {
    // width: 250,
    // marginBottom: 20,
    margin: 8,
  },
  button: {
    color: '#000',
    margin: 8,
  },
  textButton: {
    color: '#fff',
    margin: 8,
  },
});
