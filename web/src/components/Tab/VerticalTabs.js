import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { makeStyles } from '@material-ui/core/styles';

import TabPanel from 'components/Tab/TabPanel';
import Colors from 'constants/Colors';

export const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    padding: theme.spacing(2),
    backgroundColor: Colors.background.light,
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    marginRight: theme.spacing(2),
  },
  panels: {
    flex: 1,
  },
}));

export default function VerticalTabs({ tabs = [] }) {
  const classes = useStyles();
  const [tabIndex, setTabIndex] = useState(0);

  const handleChangeTab = (e, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={tabIndex}
        onChange={handleChangeTab}
        className={classes.tabs}
      >
        {tabs.map(({ label }, index) => (
          <Tab key={index} label={label} />
        ))}
      </Tabs>
      {tabs.map(({ component }, index)=>(
        <TabPanel key={index} value={tabIndex} index={index} className={classes.panels}>
          {component}
        </TabPanel>
      ))}
    </div>
  );
}

VerticalTabs.propTypes = {
  tabs: PropTypes.array,
};
