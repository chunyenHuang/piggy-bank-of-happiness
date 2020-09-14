import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import EventTable from 'components/EventTable';

const useStyles = makeStyles((theme) => ({
  content: {
    flex: 1,
    // padding: theme.spacing(2),
  },
}));

export default function Events() {
  const classes = useStyles();

  return (
    <div className={classes.content}>
      <EventTable />
    </div>
  );
}

Events.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
};
