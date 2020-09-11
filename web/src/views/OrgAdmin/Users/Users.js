import React from 'react';
import PropTypes from 'prop-types';
import querystring from 'query-string';
import { makeStyles } from '@material-ui/core/styles';

import OrganizationUserTable from 'components/OrganizationUserTable';

const useStyles = makeStyles((theme) => ({
  content: {
    flex: 1,
    // padding: theme.spacing(2),
  },
}));

export default function Users({ location }) {
  const classes = useStyles();

  const id = localStorage.getItem('app:organizationId');
  const { title, roles, hide } = querystring.parse(location.search, { arrayFormat: 'bracket' });

  return (
    <div className={classes.content}>
      <OrganizationUserTable
        organizationId={id}
        title={title}
        roles={roles}
        hide={hide}
      />
    </div>
  );
}

Users.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
};
