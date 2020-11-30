import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import AccessibilityNewIcon from '@material-ui/icons/AccessibilityNew';
import FlareIcon from '@material-ui/icons/Flare';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  root: {
    display: 'flex',
    overflow: 'hidden',
    // backgroundColor: theme.palette.secondary.light,
  },
  container: {
    marginTop: theme.spacing(15),
    marginBottom: theme.spacing(30),
    display: 'flex',
    position: 'relative',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(0, 5),
  },
  icon: {
    fontSize: 48,
  },
  image: {
    height: 55,
  },
  title: {
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  curvyLines: {
    pointerEvents: 'none',
    position: 'absolute',
    top: -180,
  },
});

function ProductValues(props) {
  const { classes } = props;

  return (
    <section className={classes.root}>
      <Container className={classes.container}>
        <img
          src="/static/themes/onepirate/productCurvyLines.png"
          className={classes.curvyLines}
          alt="curvy lines"
        />
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <AccessibilityNewIcon className={classes.icon} />
              <Typography variant="h6" className={classes.title}>
                來自社群，回饋社群
              </Typography>
              <Typography variant="h5">
                {'g0v零時小學校開源開發專案。'}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <FlareIcon className={classes.icon} />
              <Typography variant="h6" className={classes.title}>
                創造終止弱勢循環的新系統
              </Typography>
              <Typography variant="h5">
                {'提升學習動能，降低社會依賴，減少偷竊'}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.item}>
              <AttachMoneyIcon className={classes.icon} />
              <Typography variant="h6" className={classes.title}>
                設計給非營利事業組織
              </Typography>
              <Typography variant="h5">
                {'欲參與的社福機構將透過網頁版申請，並上傳相關政府核定的文件與說明，運作會由社團法人台灣城鄉永續關懷協會審核與管理。'}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </Container>
    </section>
  );
}

ProductValues.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductValues);
