import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DescriptionIcon from '@material-ui/icons/Description';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = (theme) => ({
  root: {
    display: 'flex',
    // backgroundColor: theme.palette.secondary.light,
    overflow: 'hidden',
  },
  container: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(15),
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 5),
  },
  icon: {
    fontSize: 48,
    margin: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(14),
  },
  number: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.secondary.main,
    fontWeight: theme.typography.fontWeightMedium,
  },
  image: {
    height: 55,
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  curvyLines: {
    pointerEvents: 'none',
    position: 'absolute',
    top: -180,
    opacity: 0.7,
  },
  button: {
    marginTop: theme.spacing(8),
  },
});

function ProductHowItWorks(props) {
  const { classes } = props;

  return (
    <section className={classes.root}>
      <Container className={classes.container}>
        <img
          src="/static/themes/onepirate/productCurvyLines.png"
          className={classes.curvyLines}
          alt="curvy lines"
        />
        <Typography variant="h4" marked="center" className={classes.title} component="h2">
          如何申請加入幸福存摺？
        </Typography>
        <div>
          <Grid container spacing={5}>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>1.</div>
                <PersonAddIcon className={classes.icon} />
                <Typography variant="h5" align="center">
                  註冊成為新會員
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>2.</div>
                <DescriptionIcon className={classes.icon} />
                <Typography variant="h5" align="center">
                  填寫機構資訊
                </Typography>
              </div>
            </Grid>
            <Grid item xs={12} md={4}>
              <div className={classes.item}>
                <div className={classes.number}>3.</div>
                <DoneOutlineIcon className={classes.icon} />
                <Typography variant="h5" align="center">
                  審核通過後即可使用
                </Typography>
              </div>
            </Grid>
          </Grid>
        </div>
        <Grid container justify="center" align="center" style={{ marginTop: 32 }} spacing={2}>
          <Button
            component="a"
            color="secondary"
            variant="contained"
            href={'/app?state=signup&redirect=/application'}
            className={classes.titleButton}
          >
            還沒有帳號，請點此註冊
          </Button>
          <Button
            color="inherit"
            component="a"
            href={'/app?state=signin&redirect=/application'}
            className={classes.titleButton}
          >
            已經有帳號，請點此登入
          </Button>
        </Grid>
      </Container>
    </section>
  );
}

ProductHowItWorks.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductHowItWorks);
