import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch, Redirect } from 'react-router';
import Amplify, { Auth } from 'aws-amplify';
import Analytics from '@aws-amplify/analytics';
import to from 'await-to-js';
import { onAuthUIStateChange } from '@aws-amplify/ui-components';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { makeStyles } from '@material-ui/core/styles';

import './global';
import { appRoutes } from './routes';
import awsconfig from './aws-exports.js';
import App from './App';
import * as serviceWorker from './serviceWorker';
import LandingPage from 'views/LandingPage/LandingPage';
import OrgApplication from 'views/OrgApplication/OrgApplication';
import CustomAppBar from 'components/CustomAppBar';

import './index.css';

// Disable oauth for web
delete awsconfig.oauth;

Amplify.configure(awsconfig);
Analytics.disable();

const history = createBrowserHistory();

// https://material-ui.com/customization/default-theme/
const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#89C9A3',
      main: '#68b386',
      dark: '#439463',
      contrastText: '#fff',
    },
  },
});

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    marginTop: 64,
    overflow: 'auto',
  },
}));

function ReactApp() {
  const classes = useStyles();

  const [user, setUser] = React.useState();
  const [filteredRoutes, setFilteredRoutes] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const [err, user] = await to(Auth.currentAuthenticatedUser({ bypassCache: true }));
      if (err) {
        console.log(err);
      } else {
        setUser(user);
      }
    })();
    return onAuthUIStateChange((nextAuthState, authData) => {
      setUser(authData);
    });
  }, []);

  React.useEffect(() => {
    if (!user) {
      setFilteredRoutes([]);
      return;
    }
    const userGroups = user.signInUserSession.accessToken.payload['cognito:groups'];
    const filteredRoutes = appRoutes.filter(({ roles }) => {
      return (roles) ? userGroups && userGroups.some((group) => roles.includes(group)) : true;
    });

    setFilteredRoutes(filteredRoutes);
  }, [user]);

  return (
    <Router history={history}>
      <CustomAppBar
        user={user}
        routes={filteredRoutes}
      />
      <div className={classes.content}>
        <Switch>
          <Route path="/app" component={App} />

          {user ?
            <Route path="/" component={App} />:
            <React.Fragment>
              <Route path="/application" exact component={OrgApplication} />
              <Route path="/" exact component={LandingPage} />
              <Redirect to="/" />
            </React.Fragment>}
        </Switch>
      </div>
    </Router>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ReactApp />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
