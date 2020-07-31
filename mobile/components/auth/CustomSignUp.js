import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import {
  Button,
  Text,
} from 'react-native-paper';
import { Auth } from 'aws-amplify';
import Spinner from 'react-native-loading-spinner-overlay';

import { errorAlert } from 'src/utils/alert';
import Form from '../Form';
import Colors from 'constants/Colors';

const PASSWORD_MIN_LENGTH = 8;

const fields = [
  {
    key: 'name',
    required: true,
    props: {
      label: '姓名',
      autoCorrect: false,
      mode: 'outlined',
    },
  },
  {
    key: 'email',
    required: true,
    props: {
      label: 'Email',
      autoCorrect: false,
      autoCapitalize: 'none',
      autoCompleteType: 'email',
      keyboardType: 'email-address',
    },
  },
  {
    key: 'username',
    required: true,
    props: {
      label: '帳號',
      autoCorrect: false,
      autoCapitalize: 'none',
    },
  },
  {
    key: 'password',
    required: true,
    props: {
      label: '密碼',
      autoCorrect: false,
      autoCompleteType: 'password',
      secureTextEntry: true,
    },
  },
];

export default function CustomSignUp({ authState, onStateChange }) {
  const [data, setData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState([]);

  const goto = (state) => {
    onStateChange && onStateChange(state, {});
  };

  const handleSubmit = async () => {
    const errors = fields.map(({ key, required }) => {
      if (required && !data[key]) {
        return '必填';
      } else {
        if (key === 'password' && data[key].length < PASSWORD_MIN_LENGTH) {
          return '至少8碼';
        }
        return;
      }
    });

    if (errors.filter((x) => x).length !== 0) {
      setErrors([...errors]);
      return;
    }

    setIsSubmitting(true);
    try {
      const signupInfo = {
        username: data.username,
        password: data.password,
        attributes: {
          name: data.name,
          email: data.email,
        },
      };

      await Auth.signUp(signupInfo);

      const items = [
        ['app:username', data.username],
        ['app:password', data.password],
      ];
      await AsyncStorage.multiSet(items);

      goto('confirmSignUp');
    } catch (err) {
      errorAlert(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authState !== 'signUp') return null;

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
            註冊
          </Text>

          <Form
            fields={fields}
            errors={errors}
            onUpdate={(data)=>{
              setData(data);
            }}
            onSubmit={() => handleSubmit()}
          />

          <Button
            mode="contained"
            dark={Colors.useDark}
            style={{ ...styles.button }}
            disabled={isSubmitting}
            onPress={handleSubmit}>
            註冊
          </Button>

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
