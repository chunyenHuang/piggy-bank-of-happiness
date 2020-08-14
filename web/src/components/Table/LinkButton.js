import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';

import Link from '@material-ui/core/Link';
import { Link as RouteLink } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import LaunchIcon from '@material-ui/icons/Launch';

function LinkButton({ path, label, size = 'small' }) {
  return (
    <Tooltip
      title={label}
      placement="bottom"
    >
      <Link
        to={path}
        component={RouteLink}
      >
        <IconButton
          aria-label={label}
          size={size}
        >
          <LaunchIcon />
        </IconButton>
      </Link>
    </Tooltip>
  );
}

LinkButton.propTypes = {
  label: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  size: PropTypes.string,
};

export default LinkButton;
