import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';

export default function TabPanel({ children, value, index, ...props }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...props}
    >
      {value === index && (
        <Box p={0}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.any,
  value: PropTypes.number,
  index: PropTypes.number,
};
