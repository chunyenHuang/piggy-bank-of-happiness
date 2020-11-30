import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
// import ExpandLess from '@material-ui/icons/ExpandLess';
// import ExpandMore from '@material-ui/icons/ExpandMore';
// import LinkButton from 'components/Table/LinkButton';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    position: 'relative',
    // backgroundColor: theme.palette.background.paper,
  },
  listSubHeader: {
    fontWeight: 700,
    borderBottom: '1px solid #E5E5E5',
    cursor: 'pointer',
  },
  actions: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    zIndex: 10,
  },
  actionsSpace: {
    width: 8,
    display: 'inline-block',
  },
  button: {
    margin: theme.spacing(2),
  },
  map: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

export default function InfoCard({
  children,
  title,
  link,
  mappings = [],
  data = {},
  collapse = false,
  expand: inExpand,
  hideExpand = false,
  editButton,
  onUpdate,
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(!collapse);
  const [expand, setExpand] = useState(hideExpand ? true : inExpand);

  const handleClick = () => {
    setOpen(!open);
  };

  const hasExpandFields = mappings.some((item) => item.expand);

  return (
    <Paper>
      <List className={classes.root} dense={true} disablePadding={true}>
        {title &&
        <ListSubheader
          component="li"
          className={classes.listSubHeader}
          disableSticky={true}
          onClick={handleClick}
        >
          {title}
          {/* {open ? <ExpandLess /> : <ExpandMore />} */}
        </ListSubheader>}
        <div className={classes.actions}>
          {editButton && editButton({ item: data, onUpdate: (data) => onUpdate && onUpdate(data) })}
          <div className={classes.actionsSpace} />
          {/* <LinkButton path={link || ''} label="在新頁面開啟" newTab={true} disabled={!link} /> */}
        </div>

        <Collapse in={open} timeout="auto" unmountOnExit>
          {children}
          {mappings.filter((x) => expand ? true : !x.expand).map((item, index)=>(
            <React.Fragment key={index} >
              <ListItem dense={true}>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ variant: 'body2', color: 'textSecondary', noWrap: true }}
                  secondary={(item.format ? item.format(data[item.key]) : data[item.key]) || '無' }
                  secondaryTypographyProps={{ variant: 'body1', color: 'textPrimary' }}
                />
              </ListItem>
            </React.Fragment>
          ))}
        </Collapse>
      </List>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {!hideExpand && hasExpandFields &&
        <Grid container justify="center">
          <Button
            className={classes.button}
            onClick={() => setExpand(!expand)}
            startIcon={expand ? <ExpandLessIcon color="disabled"/> : <ExpandMoreIcon color="disabled"/>}
          >
            <Typography color="textSecondary" variant="body2" component="p">
              {expand ? '顯示部分重要資料' : '顯示全部'}
            </Typography>
          </Button>
        </Grid>}
      </Collapse>
    </Paper>
  );
}

InfoCard.propTypes = {
  children: PropTypes.element,
  title: PropTypes.string,
  link: PropTypes.string,
  mappings: PropTypes.array,
  data: PropTypes.object,
  expand: PropTypes.bool,
  collapse: PropTypes.bool,
  hideExpand: PropTypes.bool,
  editButton: PropTypes.func,
  onUpdate: PropTypes.func,
};
