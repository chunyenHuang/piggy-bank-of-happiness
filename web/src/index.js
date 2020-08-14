import React from 'react';
import ReactDOM from 'react-dom';
import { createBrowserHistory } from 'history';
import { Router, Route, Switch } from 'react-router';
import Amplify, { Auth } from 'aws-amplify';
import Analytics from '@aws-amplify/analytics';
import to from 'await-to-js';
import { onAuthUIStateChange } from '@aws-amplify/ui-components';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import './global';
import awsconfig from './aws-exports.js';
import App from './App';
import * as serviceWorker from './serviceWorker';
import LandingPage from 'views/LandingPage/LandingPage';

import './index.css';

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

function ReactApp() {
  const [user, setUser] = React.useState();
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

  return (
    <Router history={history}>
      <Switch>
        <Route path="/app" component={App} />

        {user && <Route path="/" component={App} />}
        {!user && <Route path="/" component={LandingPage} />}
      </Switch>
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
