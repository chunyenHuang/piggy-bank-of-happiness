import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import Paper from '@material-ui/core/Paper';

import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import Hidden from '@material-ui/core/Hidden';

import { Link, useHistory } from 'react-router-dom';
import { Auth } from 'aws-amplify';

import Version from 'components/Version';
import cognitoGroups from 'constants/cognitoGroups';
import UserAvatar from 'components/UserAvatar';

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    // padding: theme.spacing(0, 1, 0, 2),
    padding: theme.spacing(0, 2),
    height: 64,
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    // justifyContent: 'flex-end',
    justifyContent: 'center',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  // custom
  unstyledHyperlink: {
    textDecoration: 'none',
    color: 'white',
  },
  flexbox: {
    flexGrow: 1,
  },
}));

export default function CustomAppBar({ user, routes, open, onUpdate }) {
  const classes = useStyles();
  const history = useHistory();

  const [orgName, setOrgName] = useState();
  const [openMenu, setOpenMenu] = useState(false);

  const anchorRef = useRef(null);
  const prevOpen = useRef(open);

  const username = localStorage.getItem('app:username') || '';
  const userName = localStorage.getItem('app:name') || '';
  const userCognitoGroupName = localStorage.getItem('app:cognitoGroup') || '';
  const userCognitoGroupLabel = userCognitoGroupName ? cognitoGroups.find(({ value }) => value === userCognitoGroupName).label : '';

  function handleToggleMenu() {
    setOpenMenu((prevOpen) => !prevOpen);
  }

  function handleCloseMenu(event) {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpenMenu(false);
  }

  const handleDrawerOpen = () => {
    onUpdate(true);
  };

  const handleDrawerClose = () => {
    onUpdate(false);
  };

  useEffect(() => {
    if (prevOpen.current === true && openMenu === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = openMenu;
  }, [openMenu]);

  async function handleSignOut(event) {
    handleCloseMenu(event);
    try {
      localStorage.clear();
      await Auth.signOut();
      history.push('/app');
    } catch (e) {
      history.push('/app');
    }
  }

  useEffect(() => {
    setOrgName(localStorage.getItem('app:organizationName') || '幸福存摺');
  }, [user]);

  return (
    <React.Fragment>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
        elevation={1}
      >
        <Toolbar style={{ height: 64 }}>
          {user ?
            <IconButton
              color="inherit"
              aria-label="toggle drawer"
              onClick={open ? handleDrawerClose: handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton)}
            >
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>:
            <Hidden mdUp={true}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, open && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>}
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            <Link to="/" className={classes.unstyledHyperlink} data-test-id="title">
              {orgName}
            </Link>
          </Typography>
          <div className={classes.flexbox} />
          {user ?
            <Button
              ref={anchorRef}
              color="inherit"
              aria-controls={open ? 'user-menu' : undefined}
              aria-haspopup="true"
              onClick={handleToggleMenu}
              // startIcon={<PersonIcon />}
              startIcon={<UserAvatar username={username} />}
              className={classes.titleButton}
            >
              {userName}
            </Button>:
            <Hidden smDown={true}>
              <Button
                color="inherit"
                component={Link}
                to={'/application'}
                startIcon={<PersonAddIcon />}
                className={classes.titleButton}
              >
                申請加入
              </Button>
              {/* <Button
                color="inherit"
                component={Link}
                to={'/app?state=signup'}
                startIcon={<PersonAddIcon />}
                className={classes.titleButton}
              >
                註冊
              </Button> */}
              <Button
                color="inherit"
                component={Link}
                to={'/app?state=signin'}
                startIcon={<PersonIcon />}
                className={classes.titleButton}
              >
                登入
              </Button>
            </Hidden>
          }
          <Popper
            open={openMenu}
            anchorEl={anchorRef.current}
            role={undefined}
            disablePortal
          >
            <Paper>
              <ClickAwayListener onClickAway={handleCloseMenu}>
                <MenuList id="user-menu" autoFocusItem={openMenu}>
                  <MenuItem disabled={true}>
                    <Version />
                  </MenuItem>
                  <MenuItem disabled={true}>{userCognitoGroupLabel}</MenuItem>
                  <MenuItem onClick={handleSignOut}>登出</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Popper>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant={user ? 'persistent' : null}
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
        onClose={() => onUpdate(false)}
      >
        <div className={classes.drawerHeader}>
          <img src="/images/logo-text.png" alt="Logo" width="100%" />
          {/* <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton> */}
        </div>
        <Divider />
        {user ?
          <List>
            {routes.filter((x) => !x.hideFromMenu).map((route, index) => (
              <ListItem
                key={index}
                button
                component={Link}
                to={route.link || route.path}
              >
                <ListItemIcon>{route.icon ? <route.icon /> : null}</ListItemIcon>
                <ListItemText primary={route.title} />
              </ListItem>
            ))}
            <Divider />
            <ListItem button onClick={handleSignOut}>
              <ListItemIcon><ExitToAppIcon /></ListItemIcon>
              <ListItemText primary={'登出'} />
            </ListItem>
            <div className={classes.flexbox} />
            <ListItem>
              <ListItemText>
                <Version />
              </ListItemText>
            </ListItem>
          </List>:<List>
            <ListItem button onClick={()=>history.push('/application')}>
              <ListItemIcon><PersonAddIcon /></ListItemIcon>
              <ListItemText primary={'申請加入'} />
            </ListItem>
            <Divider />
            {/* <ListItem button onClick={()=>history.push('/app', { state: 'signup' })}>
              <ListItemIcon><PersonAddIcon /></ListItemIcon>
              <ListItemText primary={'註冊'} />
            </ListItem> */}
            <ListItem button onClick={()=>history.push('/app', { state: 'signin' })}>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary={'登入'} />
            </ListItem>
          </List>}
      </Drawer>
    </React.Fragment>
  );
}

CustomAppBar.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.array.isRequired,
  open: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired,
};
