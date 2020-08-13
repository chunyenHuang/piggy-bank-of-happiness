import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import { asyncListAll } from 'utilities/graph';
import { listOrganizationUsers } from 'graphql/queries';
import OrganizationUserTable from 'components/OrganizationUserTable';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(2),
  },
}));

export default function Organization({ id: inId, computedMatch }) {
  const classes = useStyles();
  const [id, setId] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (inId) {
      setId(inId);
    } else
    if (computedMatch) {
      const { params: { id } } = computedMatch;
      setId(id);
    }
  }, [inId, computedMatch]);

  useEffect(() => {
    (async () => {
      if (id) {
        setIsLoading(true);
        try {
          const res = await asyncListAll(listOrganizationUsers, { organizationId: id });
          console.log(res);
        } catch (e) {
          console.log(e);
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [id]);

  if (!id) return null;

  if (isLoading) {
    return (
      <Grid container className={classes.content} justify="center" alignItems="center">
        <CircularProgress color="inherit" />
      </Grid>
    );
  }

  return (
    <div className={classes.content}>
      <OrganizationUserTable organizationId={id} />
    </div>
  );
}

Organization.propTypes = {
  id: PropTypes.string,
  computedMatch: PropTypes.shape({
    params: PropTypes.object,
  }),
};
