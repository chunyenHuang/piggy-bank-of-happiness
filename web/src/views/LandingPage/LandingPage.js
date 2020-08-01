import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import AndroidIcon from '@material-ui/icons/Android';
import AppleIcon from '@material-ui/icons/Apple';

const useStyles = makeStyles((theme) => ({
  content: {
    flex: 1,
    padding: theme.spacing(2),
  },
}));

export default function LandingPage() {
  const classes = useStyles();

  return (
    <Container maxWidth="sm">
      <Grid className={classes.content} container alignItems="center" justify="center" direction="column">
        <Box component="div" className={classes.content}>
          <img src="/images/logo-256.png" alt="Logo" width="256" />
        </Box>

        <Grid container justify="space-around" alignItems="center" className={classes.content}>
          <Button
            variant="outlined"
            className={classes.button}
            startIcon={<AndroidIcon />}
            href="https://play.google.com/store/apps/details?id=cloud.goldax.piggy_bank_of_happiness"
          >
            安卓版本下載
          </Button>
          <Button
            variant="outlined"
            className={classes.button}
            startIcon={<AppleIcon />}
            href="https://testflight.apple.com/join/8DJbdJnr"
          >
            蘋果版本下載
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
