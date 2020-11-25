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
import 'react-redux-toastr/lib/css/react-redux-toastr.min.css';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';

import './global';
import { appRoutes } from './routes';
import awsconfig from './aws-exports.js';
import App from './App';
import * as serviceWorker from './serviceWorker';
import LandingPage from 'views/LandingPage/LandingPage';
import OrgApplication from 'views/OrgApplication/OrgApplication';
import CustomAppBar from 'components/CustomAppBar';
import Loading from 'components/Loading';

import store from './App.reducer';
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

const initialPath = history.location;
console.log(`initialPath`, initialPath);

function ReactApp() {
  const classes = useStyles();

  const [isLoading, setIsLoading] = React.useState(true);
  const [user, setUser] = React.useState();
  const [filteredRoutes, setFilteredRoutes] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const [err, user] = await to(Auth.currentAuthenticatedUser({ bypassCache: true }));
      if (err) {
        setIsLoading(false);
        history.push(initialPath);
      } else {
        setUser(user);
        setIsLoading(false);
      }
    })();
    return onAuthUIStateChange((nextAuthState, authData) => {
      setUser(authData);
    });
  }, []);

  React.useEffect(() => {
    if (!user || !user.signInUserSession) {
      setFilteredRoutes([]);
      return;
    }
    // console.log(user);
    const organizationId = user.attributes['custom:organizationId'] || '';
    const userGroups = user.signInUserSession.accessToken.payload['cognito:groups'];
    const filteredRoutes = appRoutes
      .filter(({ roles }) => roles ? (organizationId ? true : false) : true)
      .filter(({ roles }) => {
        return (roles) ? userGroups && userGroups.some((group) => roles.includes(group)) : true;
      });

    localStorage.setItem('app:username', user.username);
    localStorage.setItem('app:name', user.attributes.name);
    localStorage.setItem('app:organizationId', organizationId);
    localStorage.setItem('app:organizationName', user.attributes['custom:organizationName'] || '');
    localStorage.setItem('app:cognitoGroup', userGroups[0]);

    setFilteredRoutes(filteredRoutes);

    history.push(initialPath);
  }, [user]);

  if (isLoading) {
    return (<Loading />);
  }

  return (
    <Router history={history}>
      <CustomAppBar
        user={user}
        routes={filteredRoutes}
      />
      <div className={classes.content}>
        <Switch>
          <Route path="/app" component={App} />
          <Route path="/application" exact component={OrgApplication} />

          {user ?
            <React.Fragment>
              <Route path="/" component={App} />
            </React.Fragment>:
            <React.Fragment>
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
      <Provider store={store}>
        <div>
          <ReduxToastr
            timeOut={10000}
            newestOnTop={false}
            preventDuplicates
            position='top-right'
            transitionIn='fadeIn'
            transitionOut='fadeOut'
            progressBar
            closeOnToastrClick={false}/>
        </div>
      </Provider>
      <ReactApp />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
