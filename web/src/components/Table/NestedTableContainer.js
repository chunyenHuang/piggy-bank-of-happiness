import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import grey from '@material-ui/core/colors/grey';

const useStyles = makeStyles((theme) => ({
  nestedContainer: {
    backgroundColor: grey['200'],
  },
  childrenContainer: {
    marginBottom: theme.spacing(4),
  },
}));

function NestedTableContainer({ columns = [], children }) {
  const classes = useStyles();

  return (
    <TableRow>
      <TableCell colSpan={columns.length + 1} className={classes.nestedContainer}>
        {Array.isArray(children) ?
          children.map((x, index)=>(
            <div key={index} className={classes.childrenContainer}>
              {x}
            </div>
          )):
          children}
      </TableCell>
    </TableRow>);
}

NestedTableContainer.propTypes = {
  columns: PropTypes.array,
  children: PropTypes.node,
};

export default NestedTableContainer;
