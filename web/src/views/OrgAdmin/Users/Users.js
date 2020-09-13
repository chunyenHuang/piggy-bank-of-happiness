import React, { useEffect, useState } from 'react';
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
  const [params, setParams] = useState();

  useEffect(() => {
    const organizationId = localStorage.getItem('app:organizationId');
    const { title, roles, hide } = querystring.parse(location.search, { arrayFormat: 'bracket' });
    setParams({
      organizationId,
      title,
      roles,
      hide,
    });
  }, [location.search]);

  if (!params) return null;

  return (
    <div className={classes.content}>
      <OrganizationUserTable
        {...params}
      />
    </div>
  );
}

Users.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
};
