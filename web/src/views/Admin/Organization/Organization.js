import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import OrganizationCard from 'components/Card/OrganizationCard';
import OrganizationPrincipalCard from 'components/Card/OrganizationPrincipalCard';
import OrganizationApplicantCard from 'components/Card/OrganizationApplicantCard';
import FileViewer from 'components/FileViewer';

import { request } from 'utilities/graph';
import { getOrganization } from 'graphql/queries';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  space: {
    height: theme.spacing(2),
  },
}));

export default function Organization({ id: inId, computedMatch }) {
  const classes = useStyles();

  const [id, setId] = useState();
  const [data, setData] = useState();

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
    if (!id) return;

    (async () => {
      const { data: { getOrganization: data } } = await request(getOrganization, { id });
      setData(data);
    })();
  }, [id]);

  if (!id || !data) {
    return null;
  }

  return (
    <Grid container spacing={2} className={classes.root}>
      <Grid item xs={12} md={4}>
        <OrganizationCard title="基本資料" data={data} />
      </Grid>
      <Grid item xs={12} md={4}>
        <OrganizationPrincipalCard title="負責人" data={data.principal} />
        <div className={classes.space} />
        <OrganizationApplicantCard title="申請人" data={data.user || { username: data.username }} />
      </Grid>
      <Grid item xs={12} md={4}>
        <FileViewer s3Prefix={`organizations/${data.id}/documents/`}/>
      </Grid>
    </Grid>
  );
}

Organization.propTypes = {
  id: PropTypes.string,
  computedMatch: PropTypes.shape({
    params: PropTypes.object,
  }),
};
