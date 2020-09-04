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
import Tooltip from '@material-ui/core/Tooltip';
import SyncIcon from '@material-ui/icons/Sync';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import DetailForm from 'react-material-final-form';

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

function Table({
  title,
  description,
  data,
  columns,
  options,
  themeProps,
  onUpdateItem,
  onRefresh,
  onAdd,
}) {
  const classes = useStyles();

  const [updatedColumns, setUpdatedColumns] = useState(columns);
  const [editDataIndex, setEditDataIndex] = useState(-1);
  const [editItem, setEditItem] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);

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
    customToolbar: () =>
      <React.Fragment>
        {onRefresh &&
          <Tooltip title={'更新資料'}>
            <IconButton
              data-testid={'refresh-iconButton'}
              aria-label={'refresh'}
              onClick={onRefresh}>
              <SyncIcon />
            </IconButton>
          </Tooltip>}
        {onAdd &&
          <Tooltip title={'新增資料'}>
            <IconButton
              data-testid={'add-iconButton'}
              aria-label={'add'}
              onClick={() => setOpenAddDialog(true)}>
              <AddIcon />
            </IconButton>
          </Tooltip>}
      </React.Fragment>,
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
    textLabels: {
      body: {
        noMatch: '抱歉，找不到相關資料',
        toolTip: '排序',
        columnHeaderTooltip: (column) => `使用[${column.label}]排序`,
      },
      pagination: {
        next: '下一頁',
        previous: '上一頁',
        rowsPerPage: '每頁顯示',
        displayRows: '總項目數',
      },
      toolbar: {
        search: '搜尋',
        downloadCsv: '下載 CSV',
        print: '列印',
        viewColumns: '顯示欄位',
        filterTable: '篩選數據',
      },
      filter: {
        all: '全部',
        title: '篩選數據',
        reset: '重設',
      },
      viewColumns: {
        title: '欄位',
        titleAria: '顯示/隱藏欄位',
      },
      // selectedRows: {
      //   text: 'row(s) selected',
      //   delete: 'Delete',
      //   deleteAria: 'Delete Selected Rows',
      // },
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
      <Dialog
        open={openAddDialog}
        onClose={()=>setOpenAddDialog(false)}
        disableBackdropClick={true}
        disableEscapeKeyDown={true}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          新增資料
          <IconButton
            onClick={()=>setOpenAddDialog(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DetailForm
            // title={'新增資料'}
            metadata={{ fields: [{key: 'name', type: 'string', label: 'name' }]}}
            onSubmit={(data) => {
              console.log(data);
            }}
            submitButtonText={'新增'}
            submitButtonProps={{
              variant: 'contained',
              color: 'primary',
              type: 'submit',
              fullWidth: true,
            }}
          />
        </DialogContent>
      </Dialog>

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
  onRefresh: PropTypes.func,
  onAdd: PropTypes.func,
};

export default Table;
