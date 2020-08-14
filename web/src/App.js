import React from 'react';
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import { AuthState, onAuthUIStateChange } from '@aws-amplify/ui-components';
import { Switch, Redirect } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';
import DocumentTitle from 'react-document-title';

import CustomAppBar from 'components/CustomAppBar';
import APP from 'constants/app.js';

import { appRoutes } from './routes';
import './Amplify.css';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    overflow: 'hidden',
  },
  content: {
    flexGrow: 1,
    marginTop: 64,
    overflow: 'auto',
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
  }, [user]);

  React.useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);

  return authState === AuthState.SignedIn && user ? (
    <div className={classes.root}>
      <CustomAppBar routes={filteredRoutes} />
      <div className={classes.content}>
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
          <Redirect to="/organizations" />
        </Switch>
      </div>
    </div>
  ) : (
    <div className="amplify-auth-container">
      <AmplifyAuthenticator>
      </AmplifyAuthenticator>
    </div>
  );
}

export default App;
