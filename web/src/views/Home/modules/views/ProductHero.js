import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AndroidIcon from '@material-ui/icons/Android';
import AppleIcon from '@material-ui/icons/Apple';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import ProductHeroLayout from './ProductHeroLayout';
import Colors from 'constants/Colors';

const backgroundImage = '/images/home/hands-2847508_1920.jpg';

const styles = (theme) => ({
  background: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundColor: Colors.background.light, // Average color of the background image.
    backgroundPosition: 'center',
  },
  button: {
    minWidth: 200,
  },
  h5: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(10),
    },
  },
  more: {
    marginTop: theme.spacing(2),
  },
});

function ProductHero(props) {
  const { classes } = props;

  return (
    <ProductHeroLayout backgroundClassName={classes.background}>
      {/* Increase the network loading priority of the background image. */}
      <img style={{ display: 'none' }} src={backgroundImage} alt="increase priority" />
      <Typography color="inherit" align="center" variant="h2" marked="center">
        幸福存摺
      </Typography>
      <Typography color="inherit" align="center" variant="h5" className={classes.h5}>
        設計給非營利事業組織兒少陪伴單位的電子系統。
      </Typography>
      <Grid container justify="center" alignItems="center">
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          style={{ marginRight: 16 }}
          startIcon={<AndroidIcon />}
          target="_blank"
          href="https://play.google.com/store/apps/details?id=cloud.goldax.piggy_bank_of_happiness"
        >
          安卓版本下載
        </Button>
        <Button
          variant="contained"
          color="default"
          className={classes.button}
          startIcon={<AppleIcon />}
          href="https://apps.apple.com/app/id1519658020" // testflight https://apps.apple.com/nz/app/%E5%B9%B8%E7%A6%8F%E5%AD%98%E6%91%BA/id1519658020s
        >
          蘋果版本下載
        </Button>
      </Grid>
    </ProductHeroLayout>
  );
}

ProductHero.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductHero);
