import React from 'react';
import {
  ConfirmSignIn,
  RequireNewPassword,
  // SignUp,
  // ConfirmSignUp,
  VerifyContact,
  // ForgotPassword,
  // TOTPSetup,
  // Loading,
} from 'aws-amplify-react-native';
import CustomSignIn from './components/auth/CustomSignIn';
import CustomSignUp from './components/auth/CustomSignUp';
import CustomConfirmSignUp from './components/auth/CustomConfirmSignUp';
import CustomForgotPassword from './components/auth/CustomForgotPassword';

// - signIn
// - signUp
// - confirmSignIn
// - confirmSignUp
// - forgotPassword
// - requireNewPassword
// - verifyContact
// - signedIn

export default {
  includeGreetings: false, // no top component
  authState: 'forgotPassword',
  authenticatorComponents: [
    // <SignIn />,
    // <SignUp signUpConfig={signUpConfig}/>,
    <CustomSignIn override={'SignIn'}/>, // eslint-disable-line
    // <ConfirmSignUp />, // eslint-disable-line
    <CustomConfirmSignUp override={'ConfirmSignUp'}/>, // eslint-disable-line
    <CustomSignUp override={'SignUp'}/>, // eslint-disable-line
    <ConfirmSignIn />, // eslint-disable-line
    <RequireNewPassword />, // eslint-disable-line
    <VerifyContact/>, // eslint-disable-line
    // <ForgotPassword />,
    <CustomForgotPassword override={'ForgotPassword'} />, // eslint-disable-line
    // <TOTPSetup />,
    // <Loading />,
  ],
};
