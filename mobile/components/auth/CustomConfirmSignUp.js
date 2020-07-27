import React, { useEffect, useState } from 'react';
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

import { errorAlert } from '../../src/utils/alert';
import Form from '../Form';

export default function CustomSignUp({ authState, onStateChange }) {
  const [savedUsername, setSavedUsername] = useState('');
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
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
        return;
      }
    });

    if (errors.filter((x) => x).length !== 0) {
      setErrors([...errors]);
      return;
    }

    setIsSubmitting(true);
    try {
      await Auth.confirmSignUp(data.username, data.code);

      const password = await AsyncStorage.getItem('app:password');
      if (password) {
        await Auth.signIn(data.username, password);
        goto('signedIn');
      } else {
        goto('signIn');
      }
    } catch (err) {
      errorAlert(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fields = [
    {
      key: 'username',
      required: true,
      props: {
        label: '帳號',
        autoCorrect: false,
        autoCapitalize: 'none',
        disabled: savedUsername ? true : false,
      },
    },
    {
      key: 'code',
      required: true,
      props: {
        label: '授權碼',
        autoCorrect: false,
        autoCapitalize: 'none',
      },
    },
  ];

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const username = await AsyncStorage.getItem('app:username');
      setSavedUsername(username);
      setIsLoading(false);
    })();
  }, [authState]);

  if (authState !== 'confirmSignUp' || isLoading) return null;

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
            註冊：確認電子信箱
          </Text>

          <Form
            fields={fields}
            errors={errors}
            defaultValue={{ username: savedUsername }}
            onUpdate={(data)=>{
              setData(data);
            }}
            onSubmit={() => handleSubmit()}
          />

          <Button
            mode="contained"
            style={{ ...styles.button }}
            disabled={isSubmitting}
            onPress={handleSubmit}>
            完成註冊
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
