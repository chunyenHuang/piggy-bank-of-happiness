import React from 'react';
import PropTypes from 'prop-types';
import {
  AmplifyAuthenticator,
  AmplifySignIn,
  AmplifySignUp,
} from '@aws-amplify/ui-react';
import {
  AuthState,
  onAuthUIStateChange,
} from '@aws-amplify/ui-components';
import { Switch, Redirect } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import DocumentTitle from 'react-document-title';
import querystring from 'query-string';
import { Hub } from 'aws-amplify';
import { toastr } from 'react-redux-toastr';

// import CustomAppBar from 'components/CustomAppBar';
import APP from 'constants/app.js';
import authErrorCodes from 'constants/authErrorCodes';

import './i18n/Amplify';
import { appRoutes } from './routes';
import './Amplify.css';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    overflow: 'hidden',
  },
}));

const authListener = ({ payload: { event, data } }) => {
  console.log(event, data);
  let errorMessage;
  switch (event) {
  case 'signUp_failure':
  case 'signIn_failure':
    errorMessage = authErrorCodes[data.code] || data.code;
    break;
  default:
  }

  if (errorMessage) {
    toastr.error(errorMessage);
  }
};

function App({ location }) {
  const classes = useStyles();

  const [authState, setAuthState] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [filteredRoutes, setFilteredRoutes] = React.useState(appRoutes);
  const [initialAuthState, setInitialAuthState] = React.useState(AuthState.SignIn);

  React.useEffect(() => {
    const { state } = querystring.parse(location.search);
    if (state) {
      console.log('change state?', state);
      setInitialAuthState(null);
      setTimeout(() => {
        setInitialAuthState(state);
      });
    }
  }, [location.search]);

  React.useEffect(() => {
    if (!user || !user.signInUserSession || !user.attributes) return;

    const userGroups = user.signInUserSession.accessToken.payload['cognito:groups'];
    const filteredRoutes = appRoutes.filter(({ roles }) => {
      return (roles) ? userGroups && userGroups.some((group) => roles.includes(group)) : true;
    });

    setFilteredRoutes(filteredRoutes);
  }, [user]);

  React.useEffect(() => {
    Hub.listen('auth', authListener);

    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <div className={classes.root} data-test-id="app-container">
      <Switch>
        {filteredRoutes.map((item)=>(
          <item.route
            key={item.path}
            exact={item.exact}
            path={item.path}
            roles={item.roles}
            user={user}
            render={ (props) => (
              <DocumentTitle title={`${APP.SHORT_NAME} | ${item.title}`}>
                <item.component {...props} />
              </DocumentTitle>)
            }/>
        ))}
        <Redirect to={filteredRoutes[0] ? filteredRoutes[0].path : '/'} />
      </Switch>
    </div>
  ) : <div className="amplify-authenticator" >
    {initialAuthState &&
      <AmplifyAuthenticator initialAuthState={initialAuthState}>
        {/* https://github.com/aws-amplify/amplify-js/issues/6113 */}
        {/* https://docs.amplify.aws/ui/auth/authenticator/q/framework/react#slots */}
        <AmplifySignIn
          slot="sign-in"
          federated={{}}
        />
        <AmplifySignUp
          slot="sign-up"
          formFields={[
            {
              type: 'name',
              label: '名字',
              placeholder: ' ',
              required: true,
            },
            {
              type: 'email',
              label: 'Email',
              placeholder: ' ',
              required: true,
            },
            {
              type: 'username',
              label: '帳號',
              placeholder: ' ',
              required: true,
            },
            {
              type: 'password',
              label: '密碼',
              placeholder: ' ',
              required: true,
            },
          ]}
        />
      </AmplifyAuthenticator>}
  </div>;
}

export default App;

App.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
};
