import React from 'react';
import {
  AmplifyAuthenticator,
  AmplifySignIn,
} from '@aws-amplify/ui-react';
import {
  AuthState,
  onAuthUIStateChange,
} from '@aws-amplify/ui-components';
import { Switch, Redirect } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import DocumentTitle from 'react-document-title';

// import CustomAppBar from 'components/CustomAppBar';
import APP from 'constants/app.js';

import './i18n/Amplify';
import { appRoutes } from './routes';
import './Amplify.css';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    overflow: 'hidden',
  },
}));

function App() {
  const classes = useStyles();

  const [authState, setAuthState] = React.useState(null);
  const [user, setUser] = React.useState(null);
  const [filteredRoutes, setFilteredRoutes] = React.useState(appRoutes);

  React.useEffect(() => {
    if (!user) return;
    const userGroups = user.signInUserSession.accessToken.payload['cognito:groups'];
    const filteredRoutes = appRoutes.filter(({ roles }) => {
      return (roles) ? userGroups && userGroups.some((group) => roles.includes(group)) : true;
    });

    setFilteredRoutes(filteredRoutes);

    localStorage.setItem('app:username', user.username);
    localStorage.setItem('app:name', user.attributes.name);
    localStorage.setItem('app:organizationId', user.attributes['custom:organizationId']);
    localStorage.setItem('app:organizationName', user.attributes['custom:organizationName']);
    localStorage.setItem('app:role', userGroups[0]);
  }, [user]);

  React.useEffect(() => {
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
  ) : (
    <AmplifyAuthenticator>
      {/* https://github.com/aws-amplify/amplify-js/issues/6113 */}
      {/* https://docs.amplify.aws/ui/auth/authenticator/q/framework/react#slots */}
      <AmplifySignIn
        slot="sign-in"
        federated={{}}
        // headerText="幸福存摺"
        // submitButtonText="登入"
        // formFields={[{
        //   type: 'username',
        //   label: '帳號',
        //   placeholder: ' ',
        //   required: true,
        // }, {
        //   type: 'password',
        //   label: '密碼',
        //   placeholder: ' ',
        //   required: true,
        // }]}
      />
    </AmplifyAuthenticator>
  );
}

export default App;
