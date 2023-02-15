import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  API,
  graphqlOperation,
} from 'aws-amplify';

import { makeStyles } from '@material-ui/core/styles';

import { asyncListAll } from 'utilities/graph';

const TIME_ZONE = 'Asia/Taipei';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));

export default function QueryGenerator({
  indexes = [],
  defaultParams = {},
  defaultIndex = 0,
  onUpdate,
  autoStart = true,
  disabled = false,
  refreshAt,
  display = true,
  appendNewData = false,
  limit = 1000,
}) {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);
  const [params, setParams] = useState(defaultParams);
  const [data, setData] = useState([]);
  const [nextToken, setNextToken] = useState();
  const [isStart, setIsStart] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);

  const handleSubmit = async (forceReload = false, inNextToken, queryAll = false) => {
    setIsLoading(true);

    try {
      const oldData = isStart ? data : [];

      setIsStart(true);

      const { partitionKey, sortKey, fields, operation } = indexes[selectedIndex];
      const queryParams = {
        limit,
        sortDirection: 'DESC',
        nextToken: inNextToken || nextToken,
      };

      if (partitionKey) {
        queryParams[partitionKey] = params[partitionKey];
      }

      if (sortKey) {
        const field = fields.find(({ key }) => key === sortKey);
        if (field) {
          if (field.type === 'date') {
            queryParams[sortKey] = {
              between: [
                moment(params[sortKey].from).tz(TIME_ZONE).startOf('day').toISOString(),
                moment(params[sortKey].to).tz(TIME_ZONE).endOf('day').toISOString(),
              ],
            };
          } else
          if (params[sortKey] !== undefined) {
            queryParams[sortKey] = {
              eq: params[sortKey],
            };
          }
        }
      }
      fields
        .filter(({ key }) => key !== partitionKey && key !== sortKey)
        .forEach(({ type, key, comparisonOperator = 'eq' }) => {
          if (type === 'date') {
            queryParams.filter = queryParams.filter || {};
            queryParams.filter[key] = {
              between: [
                moment(params[key].from).tz(TIME_ZONE).startOf('day').toISOString(),
                moment(params[key].to).tz(TIME_ZONE).endOf('day').toISOString(),
              ],
            };
          } else
          if (params[key] !== undefined) {
            queryParams.filter = queryParams.filter || {};
            queryParams.filter[key] = {
              [comparisonOperator]: params[key],
            };
          }
        });

      // console.log('queryParams', queryParams);
      let newItems;
      let token;

      if (queryAll) {
        (newItems = await asyncListAll(operation, queryParams));
      } else {
        const res = await API.graphql(graphqlOperation(operation, queryParams));
        ({ items: newItems, nextToken: token } = res.data[Object.keys(res.data)[0]]);
        setNextToken(token);

        // in case there is no data returned.
        if (newItems.length === 0 && token) {
          return handleSubmit(forceReload, token);
        }
      }

      const updatedData = forceReload === true ? newItems : (appendNewData ? [...oldData, ...newItems] : [...newItems, ...oldData]);
      setData(updatedData);

      if (!token) {
        setIsEnd(true);
      }

      if (onUpdate) {
        onUpdate(updatedData);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const renderField = (field) => {
    const props = {
      disabled: field.disabled || disabled || isLoading,
      fullWidth: true,
      name: field.key,
      value: params[field.key],
      label: field.label || field.key,
      variant: 'outlined',
      onChange: (e) => {
        setParams({
          ...params,
          [field.key]: e.target.value,
        });
      },
    };
    switch (field.type) {
    case 'date':
      return (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              {...props}
              name={`${field.key}__from`}
              type="date"
              variant="outlined"
              label={`${field.label || field.key}: 起始日期`}
              value={params[field.key].from}
              onChange={(e) => {
                params[field.key] = params[field.key] || {};
                params[field.key].from = e.target.value;
                setParams({
                  ...params,
                });
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              {...props}
              name={`${field.key}__to`}
              type="date"
              variant="outlined"
              label={'結束日期'}
              value={params[field.key].to}
              onChange={(e) => {
                params[field.key] = params[field.key] || {};
                params[field.key].to = e.target.value;
                setParams({
                  ...params,
                });
              }}
            />
          </Grid>
        </Grid>
      );
    case 'select':
      return (
        <FormControl fullWidth variant="outlined">
          <InputLabel id={`${field.key}-label`}>
            {field.label || field.key}
          </InputLabel>
          <Select
            {...props}
            labelId={`${field.key}-label`}
            id={field.key}
          >
            {field.options.map((item, index) => {
              return (<MenuItem key={index} value={item.value}>{item.label}</MenuItem>);
            })}
          </Select>
        </FormControl>
      );
    case 'string':
    default:
      return (
        <TextField
          {...props}
          type="text"
        />);
    }
  };

  const reset = () => {
    setIsStart(false);
    setIsEnd(false);
    setData([]);
    setNextToken(null);

    setTimeout(() => {
      if (autoStart && !hasAutoStarted) {
        setHasAutoStarted(true);
        handleSubmit();
      }
    });
  };

  useEffect(() => {
    if (refreshAt) {
      reset();
      setTimeout(() => {
        handleSubmit(true);
      });
    }
  }, [refreshAt]);

  useEffect(() => {
    setIsStart(false);
    setIsEnd(false);
    reset();
  }, [selectedIndex, params]);

  useEffect(() => {
    reset();
  }, []);

  if (indexes.length === 0) return null;

  return (
    <Box className={classes.root} displayPrint="none" style={{ display: display ? 'block' : 'none' }}>
      <Paper className={classes.paper} elevation={4}>
        <Grid container spacing={2} flex-direction="column">
          <Grid item md={12} container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="index-label">
                  索引
                </InputLabel>
                <Select
                  labelId="index-label"
                  id={'index'}
                  value={selectedIndex}
                  label="Index"
                  disabled={disabled || isLoading}
                  onChange={(e) => {
                    setSelectedIndex(e.target.value);
                  }}
                >
                  {indexes.map((item, index) => {
                    return (<MenuItem key={index} value={index}>{item.label}</MenuItem>);
                  })}
                </Select>
              </FormControl>
            </Grid>
            {indexes[selectedIndex].fields.map((field, index)=>(
              <Grid item xs={12} md={field.size || 12} key={index}>
                <FormControl fullWidth variant="outlined">
                  {renderField(field)}
                </FormControl>
              </Grid>
            ))}
            <Grid item xs={12} align="center" container spacing={2}>
              {isStart &&
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleSubmit()}
                disabled={disabled || isLoading || isEnd}
              >
                {isLoading ? <CircularProgress color="primary" size={24} /> : isEnd ? `共${data.length}筆資料，已無更多資料` : `目前有${data.length}筆資料，點此搜尋更多資料`}
              </Button>}
              {isStart && !isEnd && !isLoading &&
              <Button
                variant="outlined"
                color="primary"
                onClick={() => handleSubmit(undefined, undefined, true)}
                disabled={disabled || isLoading || isEnd}
                style={{ marginLeft: 16 }}
              >
                {isLoading ? <CircularProgress color="primary" size={24} /> : `搜尋全部資料(費時)`}
              </Button>}
              {!isStart &&
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmit(true) }
                disabled={disabled || isLoading || isEnd}
              >
                搜尋
              </Button>}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>);
}

QueryGenerator.propTypes = {
  indexes: PropTypes.array,
  defaultParams: PropTypes.object,
  onUpdate: PropTypes.func,
  disabled: PropTypes.bool,
  autoStart: PropTypes.bool,
  defaultIndex: PropTypes.number,
  refreshAt: PropTypes.any,
  display: PropTypes.bool,
  appendNewData: PropTypes.bool,
  limit: PropTypes.number,
};
