import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AndroidIcon from '@material-ui/icons/Android';
import AppleIcon from '@material-ui/icons/Apple';

import Version from 'components/Version';
import Colors from 'constants/Colors';
import OrgApplication from 'views/OrgApplication/OrgApplication';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  content: {
    flex: 1,
    padding: theme.spacing(4),
    // height: `calc(100vh - 64px)`,
  },
}));

export default function LandingPage() {
  const classes = useStyles();

  return (
    <Container maxWidth="sm" className={classes.root}>
      <Grid className={classes.content} container alignItems="center" justify="center" direction="column">
        <Box component="div" p={4}>
          <img src="/images/logo-256.png" alt="Logo" width="150" />
        </Box>

        <Grid container justify="space-around" alignItems="center">
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            startIcon={<AndroidIcon />}
            href="https://play.google.com/store/apps/details?id=cloud.goldax.piggy_bank_of_happiness"
          >
            安卓版本下載
          </Button>
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            startIcon={<AppleIcon />}
            href="https://apps.apple.com/app/id1519658020" // testflight https://apps.apple.com/nz/app/%E5%B9%B8%E7%A6%8F%E5%AD%98%E6%91%BA/id1519658020s
          >
            蘋果版本下載
          </Button>
        </Grid>

        <hr />

        <OrgApplication />

        <hr />

        <Box component="div" p={4} color={Colors.light}>
          <Version />
        </Box>
      </Grid>
    </Container>
  );
}
