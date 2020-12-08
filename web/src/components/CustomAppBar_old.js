import React, {
  useState,
  useRef,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  Link,
  useHistory,
} from 'react-router-dom';

import { Auth } from 'aws-amplify';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import PersonIcon from '@material-ui/icons/Person';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import Paper from '@material-ui/core/Paper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Version from 'components/Version';
import cognitoGroups from 'constants/cognitoGroups';
import UserAvatar from 'components/UserAvatar';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarSm: {
    paddingRight: 24, // keep right padding when drawer closed
    height: 64,
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  titleButton: {
    fontSize: 16,
    marginLeft: theme.spacing(2),
  },
  title: {
    // marginLeft: theme.spacing(2),
    marginRight: theme.spacing(4),
  },
  titleSm: {
    marginLeft: theme.spacing(-4),
  },
  flexbox: {
    flexGrow: 1,
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  unstyledHyperlink: {
    textDecoration: 'none',
    color: 'white',
  },
  list: {
    width: 250,
  },
}));

const elevation = 1;

export default function CustomAppBar({ user, routes }) {
  const classes = useStyles();
  const history = useHistory();

  const [open, setOpen] = useState(false);
  const [orgName, setOrgName] = useState();
  const [openDrawer, setOpenDrawer] = useState(false);

  const anchorRef = useRef(null);
  const prevOpen = useRef(open);

  const username = localStorage.getItem('app:username') || '';
  const userName = localStorage.getItem('app:name') || '';
  const userCognitoGroupName = localStorage.getItem('app:cognitoGroup') || '';
  const userCognitoGroupLabel = userCognitoGroupName ? cognitoGroups.find(({ value }) => value === userCognitoGroupName).label : '';

  useEffect(() => {
    setOrgName(localStorage.getItem('app:organizationName') || '幸福存摺');
  }, [user]);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  function handleToggleMenu() {
    setOpen((prevOpen) => !prevOpen);
  }

  function handleCloseMenu(event) {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  }

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

  const drawerList = () => (
    <div
      className={classes.list}
      role="presentation"
      onClick={() => setOpenDrawer(false)}
      onKeyDown={() => setOpenDrawer(false)}
    >
      {user ? <List>
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
          <ListItemIcon><PersonIcon /></ListItemIcon>
          <ListItemText primary={'登出'} />
        </ListItem>
        <ListItem>
          <ListItemText>
            <Version />
          </ListItemText>
        </ListItem>
      </List>:<List>
        <ListItem button onClick={()=>history.push('/application')}>
          <ListItemText primary={'機構申請加入請點此'} />
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
    </div>
  );

  return (
    <React.Fragment>
      <Hidden mdUp={true}>
        <AppBar position="fixed" color="primary" elevation={elevation}>
          <Toolbar className={classes.toolbarSm}>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpenDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.titleSm}>
              <Link to="/" className={classes.unstyledHyperlink} data-test-id="title">
                {orgName}
              </Link>
            </Typography>
            <Drawer anchor={'left'} open={openDrawer} onClose={() => setOpenDrawer(false)}>
              {drawerList()}
            </Drawer>
          </Toolbar>
        </AppBar >
      </Hidden>
      <Hidden smDown={true}>
        <AppBar position="fixed" color="primary" elevation={elevation}>
          <Toolbar className={classes.toolbar}>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
              <Link to="/" className={classes.unstyledHyperlink} data-test-id="title">
                {orgName}
              </Link>
            </Typography>
            {routes.filter((x) => !x.hideFromMenu).map((route, index) => (
              <Button
                key={index}
                color="inherit"
                component={Link}
                to={route.link || route.path}
                startIcon={route.icon ? <route.icon /> : null}
                className={classes.titleButton}
                data-test-id={route.title}
              >
                {route.title}
              </Button>
            ))}
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
              <React.Fragment>
                <Button
                  color="inherit"
                  component={Link}
                  to={'/application'}
                  startIcon={<PersonAddIcon />}
                  className={classes.titleButton}
                >
                  機構申請加入請點此
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
              </React.Fragment>
            }
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              disablePortal
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseMenu}>
                  <MenuList id="user-menu" autoFocusItem={open}>
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
      </Hidden>
    </React.Fragment>
  );
}

CustomAppBar.propTypes = {
  user: PropTypes.object,
  routes: PropTypes.array.isRequired,
};
