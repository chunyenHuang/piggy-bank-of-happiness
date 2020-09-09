import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import NumberFormat from 'react-number-format';

const useStyles = makeStyles((theme) => ({
  input: {
    fontSize: '0.875rem',
  },
}));

export default function EditField({ data: inDataObject, type, name, value, editIndex, menu: inMenu, onUpdate }) {
  const classes = useStyles();

  const [data, setData] = useState(value || '');
  const [menu, setMenu] = useState([]);

  const onChange = (e) => {
    setData(e.target.value);
    onUpdate(e.target.value);
  };

  useEffect(() => {
    (async () => {
      const menu = Array.isArray(inMenu) ? inMenu : typeof inMenu === 'function' ? await inMenu(inDataObject) : [];
      setMenu(menu);
    })();
  }, [inDataObject, inMenu]);

  let isChecked;
  switch (type) {
  case 'select':
    return (
      <Select
        fullWidth
        id={name}
        value={data}
        onChange={onChange}
        inputProps={{
          'className': classes.input,
          'data-test-id': `${name}-${editIndex}`,
        }}
      >
        {menu.map((item, index) => {
          const label = typeof item === 'string' ? item : item.label;
          const value = typeof item === 'string' ? item : item.value;
          return (<MenuItem key={index} value={value}>{label}</MenuItem>);
        })}
      </Select>
    );
  case 'number':
    return (
      <TextField
        value={data}
        onChange={onChange}
        name={name}
        type="number"
        id={name}
        inputProps={{
          'className': classes.input,
          'data-test-id': `${name}-${editIndex}`,
        }}
      />
    );
  case 'currency':
    return (
      <TextField
        value={parseFloat(data)}
        onChange={onChange}
        name={name}
        id={name}
        inputProps={{
          'className': classes.input,
          'data-test-id': `${name}-${editIndex}`,
        }}
        InputProps={{
          inputComponent: NumberFormatCustom,
        }}
      />
    );
  case 'checkbox': // TODO: handle case of 0/1 instead of boolean
    isChecked = (data == 'true' || data === 'yes' || data === true || data === 1) ? true : false; // eslint-disable-line eqeqeq

    return (
      <Checkbox
        checked={isChecked}
        value={data}
        onChange={(e) => {
          setData(e.target.checked);
          onUpdate(e.target.checked);
        }}
        name={name}
        color="default"
        inputProps={{
          'data-test-id': `${name}-${editIndex}`,
        }}
      />
    );
  case 'text':
  default:
    return (
      <TextField
        name={name}
        required
        fullWidth
        id={name}
        value={data}
        onChange={onChange}
        inputProps={{
          'minLength': 2,
          'className': classes.input,
          'data-test-id': `${name}-${editIndex}`,
        }}
        multiline
        rowsMax={4}
        size="small"
      />);
  }
}

EditField.propTypes = {
  data: PropTypes.object,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  editIndex: PropTypes.number,
  menu: PropTypes.oneOfType([PropTypes.array, PropTypes.func]),
  onUpdate: PropTypes.func,
};

function NumberFormatCustom({ inputRef, onChange, name, value, ...other }) {
  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      value={value}
      onValueChange={(values) => {
        onChange({
          target: {
            name: name,
            value: values.floatValue,
          },
        });
      }}
      format={(val) => {
        return `$ ${(parseFloat(val || 0) / 100).toFixed(2)}`;
      }}
    />
  );
}

NumberFormatCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
