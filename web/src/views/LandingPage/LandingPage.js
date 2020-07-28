import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles((theme) => ({
  content: {
    flex: 1,
    padding: theme.spacing(2),
  },
}));

export default function LandingPage() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      <Grid className={classes.content} container alignItems="center" justify="center">
        <img src="/images/logo.png" alt="Logo" width="100" />
      </Grid>
    </Container>
  );
}
