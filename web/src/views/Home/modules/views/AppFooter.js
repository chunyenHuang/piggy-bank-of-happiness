import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import GitHubIcon from '@material-ui/icons/GitHub';
import Box from '@material-ui/core/Box';

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
    padding: theme.spacing(4),
    // backgroundColor: theme.palette.secondary.light,
    // marginTop: theme.spacing(8),
    // marginBottom: theme.spacing(8),
  },
  container: {
    // marginTop: theme.spacing(8),
    // marginBottom: theme.spacing(8),
    // display: 'block',
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
  line: {
    height: theme.spacing(2),
    width: 100,
    borderBottom: `1px solid ${Colors.light}`,
    marginBottom: theme.spacing(2),
  },
}));

const linkBox = (title, link) => {
  return (<Box p={2}>
    <Link href={link} target="_blank" rel="noopener noreferrer">
      {title}
    </Link>
  </Box>);
};

export default function AppFooter() {
  const classes = useStyles();

  return (
    <Grid container className={classes.root} direction="column" justify="center" alignItems="center">
      <Container className={classes.container}>
        <Grid container spacing={2} justify="center" alignItems="center">
          {linkBox('小草書屋∞青草職能學苑', 'http://www.grassbookhouse.org.tw/')}
          {linkBox('g0v sch001 零時小學校', 'https://sch001.g0v.tw/')}
          {linkBox('Goldax LLC', 'https://goldax.cloud/')}
        </Grid>
      </Container>
      <div className={classes.line} />
      <Container className={classes.container}>
        <Grid container spacing={2} justify="center" alignItems="center">
          <Box p={2}>
            <Copyright />
          </Box>
          {linkBox('討論共筆', 'https://g0v.hackmd.io/hYxXZzK0TW6S6cD2mpSWdQ')}
          {linkBox('服務條款', 'https://raw.githubusercontent.com/chunyenHuang/piggy-bank-of-happiness/develop/documentation/Terms.md')}
          {linkBox('隱私權聲明', 'https://raw.githubusercontent.com/chunyenHuang/piggy-bank-of-happiness/develop/documentation/Privacy%20Policy.md')}
          <Box component="div" p={2} color={Colors.light}>
            <Version />
          </Box>
          <a href="https://github.com/chunyenHuang/piggy-bank-of-happiness" className={classes.icon} target="_blank" rel="noopener noreferrer">
            <GitHubIcon />
          </a>
        </Grid>
      </Container>
    </Grid>
  );
}
