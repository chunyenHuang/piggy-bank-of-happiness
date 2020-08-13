import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MUIDataTable from 'mui-datatables';
import moment from 'moment';
import deepcopy from 'deepcopy';

import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import Checkbox from '@material-ui/core/Checkbox';

import Footer from './Footer';
import EditField from './EditField';

const useStyles = makeStyles((theme) => ({
  number: {
    textAlign: 'right',
  },
}));

const theme = (props = {}) => {
  const { cell = {} } = props;
  const cellStyle = Object.assign({

  }, cell);

  return createMuiTheme({
    overrides: {
      MUIDataTable: {},
      MUIDataTableHeadCell: {
        root: {
          ...cellStyle,
          fontWeight: 'bold',
        },
      },
      MUIDataTableBodyCell: {
        root: cellStyle,
      },
      MUIDataTableSelectCell: {
        expandDisabled: {
          // Soft hide the button.
          visibility: 'hidden',
        },
      },
      MUIDataTableFilter: {
        root: {
          minWidth: 400,
        },
      },
    },
  });
};

const NON_EDITABLE_FIELDS = ['actions', 'createdAt', 'updatedAt', 'username'];

function Table({ title, description, data, columns, options, themeProps, onUpdateItem }) {
  const classes = useStyles();

  const [updatedColumns, setUpdatedColumns] = useState(columns);
  const [editDataIndex, setEditDataIndex] = useState(-1);
  const [editItem, setEditItem] = useState(null);

  // overwrite options
  const updatedOptions = Object.assign({
    enableNestedDataAccess: '.',
    pagination: true,
    responsive: 'standard',
    rowsPerPageOptions: [10, 20, 100],
    rowsPerPage: 10,
    filterType: 'checkbox',
    fixedHeader: true,
    resizableColumns: false,
    selectableRows: 'none',
    print: true,
    download: true,
    downloadOptions: {
      filename: `${title}.csv`,
      separator: ',',
    },
    expandableRows: false,
    isRowExpandable: () => false,
    isRowSelectable: () => false,
    onRowClick: (rowData, rowMeta) => {
      const item = data[rowMeta.dataIndex];
      console.log(item);
    },
    customFooter: (count, page, rowsPerPage, changeRowsPerPage, changePage, textLabels) => {
      return (
        <Footer
          description={description}
          count={count}
          page={page}
          rowsPerPage={rowsPerPage}
          changeRowsPerPage={changeRowsPerPage}
          changePage={changePage}
          textLabels={textLabels} />
      );
    },
  }, options);

  useEffect(() => {
    const newColumns = deepcopy(columns);

    const hasEditColumn = newColumns.some(({ edit }) => edit);
    if (hasEditColumn && !newColumns.find(({ name }) => name === 'actions')) {
      newColumns.push({
        name: 'actions',
        label: ' ',
        type: 'actions',
        options: {
          display: true,
          filter: false,
          sort: false,
          customBodyRenderLite: (dataIndex) => {
            const isEditing = dataIndex === editDataIndex;
            const color = isEditing ? 'primary' : 'inherit';
            return (
              <div>
                <IconButton
                  aria-label="edit"
                  size="small"
                  color={color}
                  onClick={() => {
                    if (isEditing) {
                      // TODO: update, cancel, alert
                      if (onUpdateItem) {
                        onUpdateItem(editItem, editDataIndex);
                      }
                      setEditDataIndex(-1);
                      setEditItem(null);
                    } else {
                      setEditDataIndex(dataIndex);
                      setEditItem(JSON.parse(JSON.stringify(data[dataIndex])));
                    }
                  }}
                >
                  {isEditing ? <SaveIcon /> : <EditIcon />}
                </IconButton>
              </div>
            );
          },
        },
      });
    }

    newColumns.map((column, index) => {
      if (!Object.prototype.hasOwnProperty.call(column, 'options')) {
        column.options = {};
      }
      return column;
    }).forEach(({ name, edit, type, options = {} }) => {
      switch (type) {
      case 'actions':
        break;
      case 'datetime':
        options.customBodyRender = (value) => value ? moment(value).format('YYYY/MM/DD h:mm a') : '';
        break;
      case 'checkbox':
        options.customBodyRender = (value) => {
          const isChecked = (value == 'true' || value === 'yes' || value === true || value === 1) ? true : false;
          return (<Checkbox checked={isChecked} />);
        };
        break;
      case 'number':
        options.customBodyRender = (val) => (
          <div className={classes.number}>
            {!isNaN(val) ? new Intl.NumberFormat().format(val) : 'N/A'}
          </div>
        );
        break;
      case 'currency':
        options.customBodyRender = (val) => (
          <div className={classes.number}>
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val / 100)}
          </div>
        );
        break;
      case 'boolean':
        options.customBodyRender = (val) => val ? 'yes' : 'no';
        break;
      default:
        options.customBodyRender = options.customBodyRender || ((val) => val ? val : null);
        break;
      }

      if (editDataIndex !== -1 && edit && !NON_EDITABLE_FIELDS.includes(name)) {
        options.display = true;
        options.customBodyRenderLite = (dataIndex) => {
          const defaultValue = data[dataIndex][name];
          const currentValue = editItem[name];

          return (dataIndex === editDataIndex) ?
            <EditField
              name={name}
              data={editItem}
              value={currentValue}
              editIndex={dataIndex}
              {...edit}
              onUpdate={(value) => {
                editItem[name] = value;
                if (edit.rerenderAfterSelect) {
                  // only reset the editItem if needed
                  setEditItem({ ...editItem });
                } else {
                  setEditItem(editItem);
                }
              }} /> :
            options.customBodyRender ? options.customBodyRender(defaultValue) : defaultValue;
        };
      }
    });

    setUpdatedColumns(newColumns);
  }, [columns, editDataIndex, data, editItem, onUpdateItem, classes.number]);

  return (
    <MuiThemeProvider theme={theme(themeProps)}>
      <MUIDataTable
        title={title}
        data={data}
        columns={updatedColumns}
        options={updatedOptions}
      />
    </MuiThemeProvider>
  );
}

Table.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  data: PropTypes.array,
  columns: PropTypes.array,
  options: PropTypes.object,
  nested: PropTypes.bool,
  themeProps: PropTypes.object,
  maxHeight: PropTypes.string,
  onUpdateItem: PropTypes.func,
};

export default Table;
