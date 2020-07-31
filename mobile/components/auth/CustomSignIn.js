import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  StatusBar,
  TouchableOpacity,
  Text,
  AsyncStorage,
  ScrollView,
} from 'react-native';
import {
  TextInput,
  Button,
} from 'react-native-paper';
import { Auth, Hub } from 'aws-amplify';
import {
  SocialIcon,
  // Divider,
  Image,
} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';

import Version from 'components/Version.js';
import Colors from '../../constants/Colors';
import { errorAlert } from '../../src/utils/alert';
// import { listOrganizations } from '../../src/graphql/queries';
// import request from '../../src/utils/request';

const PASSWORD_MIN_LENGTH = 8;

let willUnmount = false;

let secondTextInput = null;

export default function CustomSignIn({ authState, onStateChange }) {
  const [user, setUser] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestNewPassword, setRequestNewPassword] = useState(false);
  // const [organizations, setOrganizations] = useState([]);

  const authListener = ({ payload: { event, data } }) => {
    switch (event) {
    case 'signOut':
    case 'signIn':
      if (!willUnmount) {
        setIsSubmitting(false);
      }
      break;
    case 'signIn_failure':
    case 'cognitoHostedUI_failure':
    case 'customState_failure':
      setIsSubmitting(false);
      break;
    default:
    }
  };

  const appListener = ({ payload: { event, data } }) => {
    switch (event) {
    case 'oauth_cancel':
    case 'oauth_failed':
      setIsSubmitting(false);
      break;
    default:
    }
  };

  useEffect(() => {
    (async () => {
      Hub.listen('auth', authListener);
      Hub.listen('app', appListener);

      // const { data: { listOrganizations: { items: organizations } } } = await request(listOrganizations, {
      //   limit: 100,
      // });
      // setOrganizations(organizations);
    })();

    return () => {
      willUnmount = true;
      Hub.remove('auth', authListener);
      Hub.remove('app', appListener);
    };
  }, []);

  const goto = (state) => {
    onStateChange && onStateChange(state, {});
  };

  const submit = async () => {
    setIsSubmitting(true);

    try {
      const user = await Auth.signIn(username, password);
      await AsyncStorage.setItem('app:username', username);
      setUser(user);

      if (user.challengeName === 'SMS_MFA' ||
        user.challengeName === 'SOFTWARE_TOKEN_MFA') {
        // TODO:
        // // You need to get the code from the UI inputs
        // // and then trigger the following function with a button click
        // const code = getCodeFromUserInput();
        // // If MFA is enabled, sign-in should be confirmed with the confirmation code
        // const loggedUser = await Auth.confirmSignIn(
        //   user, // Return object from Auth.signIn()
        //   code, // Confirmation code
        //   mfaType, // MFA Type e.g. SMS_MFA, SOFTWARE_TOKEN_MFA
        // );
      } else
      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        // TODO:
        setRequestNewPassword(true);
      } else
      if (user.challengeName === 'MFA_SETUP') {
        // TODO:
        // This happens when the MFA method is TOTP
        // The user needs to setup the TOTP before using it
        // More info please check the Enabling MFA part
        Auth.setupTOTP(user);
      } else {
        goto('signedIn');
      }
    } catch (err) {
      if (err.code === 'UserNotConfirmedException') {
        // The error happens if the user didn't finish the confirmation step when signing up
        // In this case you need to resend the code and confirm the user
        // About how to resend the code and confirm the user, please check the signUp part
        goto('confirmSignUp');
      } else if (err.code === 'PasswordResetRequiredException') {
        // The error happens when the password is reset in the Cognito console
        // In this case you need to call forgotPassword to reset the password
        // Please check the Forgot Password part.
      } else if (err.code === 'NotAuthorizedException') {
        // The error happens when the incorrect password is provided
      } else if (err.code === 'UserNotFoundException') {
        // The error happens when the supplied username/email does not exist in the Cognito user pool
      } else {
        global.logger.error(err);
      }

      errorAlert(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmResetPassword = async () => {
    setIsSubmitting(true);
    try {
      await Auth.completeNewPassword(
        user,
        newPassword,
      );
      await submit();
    } catch (err) {
      global.logger.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authState !== 'signIn') return null;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      enabled
      style={styles.container}
    >
      <ScrollView style={styles.scrollContainer}>
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
          {Platform.OS === 'ios' && <StatusBar barStyle="light-content"/>}
          <View style={styles.scrollContainer}>
            <View style={styles.logoContainer}>
              <Image
                style={styles.logo}
                source={require('../../assets/images/logo-256.png')} />
            </View>
            <View style={styles.loginContainer}>
              <TextInput
                label="帳號"
                mode="outlined"
                // autoFocus={true}
                disabled={requestNewPassword}
                autoCompleteType={'email'}
                keyboardType="email-address"
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                autoCapitalize={'none'}
                returnKeyType={'next'}
                onSubmitEditing={()=> secondTextInput.focus()}
              />
              {!requestNewPassword &&
              <TextInput
                label='密碼'
                ref={(input) => secondTextInput = input}
                mode="outlined"
                autoCompleteType={'password'}
                disabled={requestNewPassword}
                secureTextEntry={true}
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                autoCapitalize={'none'}
                returnKeyType={'send'}
                onSubmitEditing={submit}
              />}
              {requestNewPassword &&
              <TextInput
                label='新密碼'
                mode="outlined"
                autoFocus={true}
                autoCompleteType={'password'}
                secureTextEntry={true}
                style={styles.input}
                onChangeText={(value)=>{
                  setNewPassword(value);
                  setPassword(value);
                }}
                value={newPassword}
                autoCapitalize={'none'}
                returnKeyType={'go'}
                onSubmitEditing={submit}
                enablesReturnKeyAutomatically={true}
              />}
              {!requestNewPassword &&
              <Button
                mode="contained"
                dark={Colors.useDark}
                style={{ ...styles.button }}
                disabled={!username || password.length < PASSWORD_MIN_LENGTH || isSubmitting}
                onPress={submit}>
                登入
              </Button>}
              {requestNewPassword &&
              <Button
                style={styles.button}
                disabled={!newPassword || isSubmitting}
                onPress={confirmResetPassword}>
                確認修改新密碼
              </Button>}
              {!requestNewPassword &&
              <Button
                style={styles.textButton}
                onPress={()=>goto('forgotPassword')}>
                忘記密碼
              </Button>}

              <SocialIcon
                title='Facebook 帳號登入'
                button
                type='facebook'
                style={styles.socialButton}
                onPress={() => {
                  setIsSubmitting(true);
                  Auth.federatedSignIn({ provider: 'Facebook' });
                }}
              />
              <SocialIcon
                title='Google 帳號登入'
                button
                type='google'
                style={styles.socialButton}
                onPress={() => {
                  setIsSubmitting(true);
                  Auth.federatedSignIn({ provider: 'Google' });
                }}
              />
              <TouchableOpacity
                style={styles.registerButton}
                onPress={()=>goto('signUp')}>
                <Text style={styles.textButton}>
                  註冊
                </Text>
              </TouchableOpacity>
              <Version />
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
    width: '100%',
    maxWidth: 600,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 150,
  },
  header: {
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 30,
    fontSize: 25,
  },
  loginContainer: {
    // marginTop: 300,
    backgroundColor: '#fff',
    // borderWidth: 1,
    // borderColor: Colors.primary,
    padding: 32,
    paddingTop: 8,
    borderRadius: 10,
  },
  socialButton: {
    borderRadius: 5,
    // margin: 0,
  },
  divider: {
    backgroundColor: Colors.primary,
    marginTop: 12,
    marginBottom: 6,
    marginLeft: 8,
    marginRight: 8,
  },
  input: {
    // width: 250,
    // marginBottom: 20,
    margin: 8,
  },
  button: {
    margin: 8,
  },
  textButton: {
    color: '#fff',
    margin: 8,
  },
  registerButton: {
    backgroundColor: Colors.accent,
    margin: 7,
    borderRadius: 5,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
  },
});
