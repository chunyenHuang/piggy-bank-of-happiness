import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import DocumentTitle from 'react-document-title';

import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import querystring from 'query-string';
import Box from '@material-ui/core/Box';

import TabPanel from 'components/TabPanel';
import OrganizationUserTable from 'components/OrganizationUserTable';
import OrganizationProfile from 'components/OrganizationProfile';
import OrganizationProgramTable from 'components/OrganizationProgramTable';

import { request } from 'utilities/graph';
import { getOrganization } from 'graphql/queries';

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    marginRight: theme.spacing(2),
  },
  panels: {
    width: '100%',
  },
}));

export default function Organization({ id: inId, computedMatch, location }) {
  const classes = useStyles();
  const history = useHistory();

  const [id, setId] = useState();
  const [data, setData] = useState();

  const [tab, setTab] = React.useState(1);

  const handleChangeTab = (e, newValue) => {
    setTab(newValue);
    history.push({
      pathname: history.location.pathname,
      search: `?tab=${newValue}`,
    });
  };

  useEffect(() => {
    if (computedMatch) {
      const { params: { id } } = computedMatch;
      setId(id);
    }
  }, [computedMatch]);

  useEffect(() => {
    if (location.search) {
      const { tab } = querystring.parse(location.search);
      if (!isNaN(tab)) {
        setTab(parseInt(tab));
      }
    }
  }, [location.search]);

  useEffect(() => {
    if (inId) {
      setId(inId);
    }
  }, [inId]);

  useEffect(() => {
    (async () => {
      if (id) {
        const { data: { getOrganization: data } } = await request(getOrganization, { id });
        setData(data);
      }
    })();
  }, [id]);

  const tabs = [
    {
      label: '基本資料',
      render: () => <OrganizationProfile data={data} />,
    },
    {
      label: '人員列表',
      render: () => <OrganizationUserTable organizationId={id} />,
    },
    {
      label: '任務列表',
      render: () => <OrganizationProgramTable organizationId={id} />,
    },
  ];

  if (!id || !data) return null;

  return (
    <DocumentTitle title={data.name}>
      <Box p={2} className={classes.content}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={tab}
          onChange={handleChangeTab}
          className={classes.tabs}
        >
          <Tab label={data.name} disabled={true} />
          {tabs.map(({ label })=>(
            <Tab key={label} label={label} />
          ))}
        </Tabs>
        {tabs.map(({ render }, index)=> (
          <TabPanel key={index} value={tab} index={index+1} className={classes.panels}>
            {render()}
          </TabPanel>
        ))}
      </Box>
    </DocumentTitle>
  );
}

Organization.propTypes = {
  id: PropTypes.string,
  computedMatch: PropTypes.shape({
    params: PropTypes.object,
  }),
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
};
