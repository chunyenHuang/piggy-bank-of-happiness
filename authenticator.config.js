import React from 'react';
import {
  ConfirmSignIn,
  RequireNewPassword,
  // SignUp,
  ConfirmSignUp,
  VerifyContact,
  ForgotPassword,
  // TOTPSetup,
  Loading,
} from 'aws-amplify-react-native';
import CustomSignIn from './components/auth/CustomSignIn';
import CustomSignUp from './components/auth/CustomSignUp';

// const signUpConfig = {
//   header: 'Goldax Loyalty',
//   hideAllDefaults: true,
//   defaultCountryCode: '1',
//   signUpFields: [{
//       label: 'Username',
//       key: 'username',
//       required: true,
//       displayOrder: 1,
//       type: 'string',
//     },
//     {
//       label: 'Password',
//       key: 'password',
//       required: true,
//       displayOrder: 2,
//       type: 'password',
//     },
//     {
//       label: 'First Name',
//       key: 'given_name',
//       required: true,
//       displayOrder: 3,
//       type: 'string',
//     },
//     {
//       label: 'Last name',
//       key: 'family_name',
//       required: true,
//       displayOrder: 4,
//       type: 'string',
//     },
//     {
//       label: 'Phone number',
//       key: 'phone_number',
//       required: true,
//       displayOrder: 5,
//       type: 'string',
//     }
//   ]
// }
export default {
  includeGreetings: false, // no top component
  authenticatorComponents: [
    // <SignIn />,
    // <SignUp signUpConfig={signUpConfig}/>,
    <CustomSignIn override={'SignIn'}/>,
    <ConfirmSignUp />,
    <CustomSignUp override={'SignUp'}/>,
    <ConfirmSignIn />,
    <RequireNewPassword />,
    <VerifyContact/>,
    <ForgotPassword />,
    // <TOTPSetup />,
    <Loading />,
  ],
}
