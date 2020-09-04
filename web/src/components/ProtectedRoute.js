import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Auth } from 'aws-amplify';

import { makeStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ProtectedRoute = ({ component: Component, render, roles, user: inUser, ...args }) => {
  const classes = useStyles();

  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [isAuthorized, setIsAuthorized] = useState(undefined);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (roles) {
      const userGroups = user.signInUserSession.accessToken.payload['cognito:groups'];
      const isAuthorized = userGroups && userGroups.some((group) => roles.includes(group)) ? true : false;
      setIsAuthorized(isAuthorized);
    } else {
      setIsAuthorized(true);
    }
  }, [user, roles, isAuthenticated]);

  useEffect(() => {
    (async () => {
      if (!user) {
        try {
          const user = inUser || await Auth.currentAuthenticatedUser({
            bypassCache: true,
          });
          if (user) {
            setUser(user);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (e) {
          if (e === 'not authenticated') {
            setIsAuthenticated(false);
          }
        }
      }
    })();
  }, [user, inUser]);

  if (isAuthenticated === false) {
    return (<Redirect to={{ pathname: '/signin' }} />);
  }

  if (isAuthorized === false) {
    return (<Redirect to={{ pathname: '/dashboard' }} />);
  }

  if (!user || isAuthorized === undefined || isAuthenticated === undefined) {
    return (
      <Backdrop className={classes.backdrop} open={!user}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return render ? render({ user, ...args }) : (<Component user={user} {...args} />);
};

ProtectedRoute.propTypes = {
  render: PropTypes.func,
  component: PropTypes.elementType,
  roles: PropTypes.array,
  user: PropTypes.object,
};

export default ProtectedRoute;
