import React from 'react';
import PropTypes from 'prop-types';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import MuiTablePagination from '@material-ui/core/TablePagination';
import { withStyles } from '@material-ui/core/styles';

const defaultFooterStyles = {};
const footerStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '0px 24px 0px 24px',
};

function Footer({ description = '', count, textLabels, rowsPerPage, page, changePage, changeRowsPerPage }) {
  return (
    <TableFooter>
      <TableRow>
        <TableCell>
          {description}
        </TableCell>
        <TableCell style={footerStyle} colSpan={1000}>
          <MuiTablePagination
            component='div'
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            labelRowsPerPage={textLabels.rowsPerPage}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${textLabels.displayRows} ${count}`}
            backIconButtonProps={{
              'aria-label': textLabels.previous,
            }}
            nextIconButtonProps={{
              'aria-label': textLabels.next,
            }}
            rowsPerPageOptions={[10, 20, 100]}
            onChangePage={(_, page) => changePage(page)}
            onChangeRowsPerPage={(event) => changeRowsPerPage(event.target.value)}
          />
        </TableCell>
      </TableRow>
    </TableFooter>
  );
}

Footer.propTypes = {
  description: PropTypes.string,
  count: PropTypes.any,
  classes: PropTypes.any,
  textLabels: PropTypes.any,
  rowsPerPage: PropTypes.any,
  page: PropTypes.any,
  changeRowsPerPage: PropTypes.func,
  changePage: PropTypes.func,
};

export default withStyles(defaultFooterStyles, { name: 'Footer' })(Footer);
