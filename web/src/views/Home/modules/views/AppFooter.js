import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import GitHubIcon from '@material-ui/icons/GitHub';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import Version from 'components/Version';
import Colors from 'constants/Colors';
// import TextField from '../components/TextField';

function Copyright() {
  return (
    <React.Fragment>
      {'© '}
      <Link color="inherit" href="https://www.happinessbankbook.org/">
        幸福存摺
      </Link>{' '}
      {new Date().getFullYear()}
    </React.Fragment>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    backgroundColor: Colors.background.light,
    // backgroundColor: theme.palette.secondary.light,
  },
  container: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: 'flex',
  },
  iconsWrapper: {
    height: 120,
  },
  icons: {
    display: 'flex',
  },
  icon: {
    width: 48,
    height: 48,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing(1),
  },
  list: {
    margin: 0,
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  language: {
    marginTop: theme.spacing(1),
    width: 150,
  },
}));

const LANGUAGES = [
  {
    code: 'en-US',
    name: 'English',
  },
  {
    code: 'fr-FR',
    name: 'Français',
  },
];

export default function AppFooter() {
  const classes = useStyles();

  return (
    <Typography component="footer" className={classes.root}>
      <Container className={classes.container}>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Box p={2}>
            <Copyright />
          </Box>
          <Box p={2}>
            <Link href="https://g0v.hackmd.io/hYxXZzK0TW6S6cD2mpSWdQ">
              討論共筆
            </Link>
          </Box>
          <Box p={2}>
            <Link href="https://raw.githubusercontent.com/chunyenHuang/piggy-bank-of-happiness/develop/documentation/Terms.md">
              服務條款
            </Link>
          </Box>
          <Box p={2}>
            <Link href="https://raw.githubusercontent.com/chunyenHuang/piggy-bank-of-happiness/develop/documentation/Privacy%20Policy.md">
              隱私權聲明
            </Link>
          </Box>
          <Box component="div" p={2} color={Colors.light}>
            <Version />
          </Box>
          <a href="https://github.com/chunyenHuang/piggy-bank-of-happiness" className={classes.icon} target="_blank" rel="noreferrer">
            <GitHubIcon />
          </a>
        </Grid>
      </Container>
    </Typography>
  );
}
