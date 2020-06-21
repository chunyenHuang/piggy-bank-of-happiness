import React, { Component } from 'react';
import {
  Alert,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
} from 'react-native-paper';
import { Auth } from 'aws-amplify';
import { SocialIcon, Divider } from 'react-native-elements';

import Colors from '../../constants/Colors';
// import Footer from '../Footer';

const PASSWORD_MIN_LENGTH = 8;

export default class CustomSignUp extends Component {
  state = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    isSubmitting: false,
  }

  secondTextInput = null;
  thirdTextInput = null;
  fourthTextInput = null;
  fifthTextInput = null;

  componentDidMount = () => {
    // if (__DEV__) {
    //   this.setState({
    //     username: 'little78926@gmail.com',
    //     password: 'password',
    //     firstName: 'John',
    //     lastName: 'Huang',
    //   })
    // }
  }

  goto = (state) => {
    this.props.onStateChange(state, {});
  }

  submit = async () => {
    this.setState({ isSubmitting: true });
    // https://github.com/aws-amplify/amplify-js/blob/master/packages/aws-amplify-react-native/src/Auth/SignUp.js
    try {
      const signupInfo = {
        username: this.state.username,
        password: this.state.password,
        attributes: {
          given_name: this.state.firstName,
          family_name: this.state.lastName,
          email: this.state.username,
        },
      };

      const data = await Auth.signUp(signupInfo);
      this.goto('confirmSignUp');
    } catch (e) {
      this.setState({ isSubmitting: false });

      if (e.code) {
        return Alert.alert('Oops...', `${e.message}`, [{ text: 'ok' }]);
      }
      global.logger.error(e);
    }
  }

  setInfo = (key) => {
    return (value) => {
      let isValid = true;

      if (!this.state.username || this.state.username === '') {
        isValid = false;
      }

      if (!this.state.password || this.state.password.length < 8) {
        isValid = false;
      }

      if (!this.state.firstName || this.state.firstName === '') {
        isValid = false;
      }

      if (!this.state.lastName || this.state.lastName === '') {
        isValid = false;
      }

      this.setState({
        [key]: value,
        isValid,
      });
    };
  }

  render() {
    if (this.props.authState !== 'signUp') return null;

    return (
      <KeyboardAvoidingView
        behavior="padding"
        enabled
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.container}
          activeOpacity={1}
          onPress={Keyboard.dismiss}
          accessible={false}>
          {Platform.OS === 'ios' && <StatusBar barStyle="light-content"/>}
          <View style={styles.scrollContainer}>
            <View style={styles.loginContainer}>
              <Text style={{ textAlign: 'center' }}>Sign Up</Text>
              <TextInput
                label="Email"
                mode="outlined"
                autoFocus={true}
                autoCompleteType={'email'}
                style={styles.input}
                keyboardType="email-address"
                onChangeText={this.setInfo('username')}
                value={this.state.username}
                autoCapitalize={'none'}
                returnKeyType={'next'}
                onSubmitEditing={()=> this.secondTextInput.focus()}
              />
              <TextInput
                label='Password'
                ref={(input) => this.secondTextInput = input}
                mode="outlined"
                autoCompleteType={'password'}
                secureTextEntry={true}
                style={styles.input}
                onChangeText={this.setInfo('password')}
                value={this.state.password}
                autoCapitalize={'none'}
                returnKeyType={'next'}
                onSubmitEditing={()=> this.thirdTextInput.focus()}
              />
              <TextInput
                label='First Name'
                ref={(input) => this.thirdTextInput = input}
                mode="outlined"
                style={styles.input}
                onChangeText={this.setInfo('firstName')}
                value={this.state.firstName}
                autoCapitalize={'words'}
                returnKeyType={'next'}
                onSubmitEditing={()=> this.fourthTextInput.focus()}
              />
              <TextInput
                label='Last Name'
                ref={(input) => this.fourthTextInput = input}
                mode="outlined"
                style={styles.input}
                onChangeText={this.setInfo('lastName')}
                value={this.state.lastName}
                autoCapitalize={'words'}
                returnKeyType={'send'}
                onSubmitEditing={()=> this.submit()}
              />

              <Button
                mode="contained"
                style={styles.button}
                disabled={this.isSubmitting || !this.state.isValid}
                onPress={()=>this.submit()}>
              Sign up
              </Button>

              <Divider style={styles.divider} />

              <Button
                style={{ ...styles.button, marginTop: 5 }}
                onPress={()=>this.goto('signIn')}>
              Back to Sign In
              </Button>
            </View>
            {/* <Footer/> */}
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    width: '100%',
    alignItems: 'center',
    marginTop: -50,
    marginBottom: -50,
    paddingTop: 50,
    paddingBottom: 50,
  },
  scrollContainer: {
    flex: 1,
    padding: 32,
    width: '100%',
  },
  logoContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'gray',
  },
  logo: {
    width: 100,
    height: 100,
    // margin: 50,
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
    padding: 32,
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
    // width: 300,
    // marginTop: 10,
    // marginBottom: 5,
    // backgroundColor: '#fff'
    color: '#000',
    margin: 8,
  },
  textButton: {
    color: '#fff',
  },
});
