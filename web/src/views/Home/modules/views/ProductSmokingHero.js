import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { withStyles } from '@material-ui/core/styles';
import Typography from '../components/Typography';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10),
  },
  button: {
    border: '2px solid currentColor',
    borderRadius: 0,
    height: 'auto',
    padding: theme.spacing(2, 5),
  },
  link: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  buoy: {
    width: 60,
  },
});

function ProductSmokingHero(props) {
  const { classes } = props;

  return (
    <Container className={classes.root} component="section">
      <div className={classes.button}>
        <Typography variant="h5" component="span">
          台灣每年約有4萬3千名高風險家庭的兒少、2萬3千名中離學生及4千名中輟生，因為家庭功能不足，獨自面對學習落後、生存挑戰，甚至提早離開學習現場，繼續陷入惡性循環。
        </Typography>
      </div>
      {/* <Typography variant="subtitle1" className={classes.link}>
        We are here to help. Get in touch!
      </Typography>
      <img src="/static/themes/onepirate/producBuoy.svg" className={classes.buoy} alt="buoy" /> */}
    </Container>
  );
}

ProductSmokingHero.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductSmokingHero);
