import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import Table from 'components/Table/Table';
import { asyncListAll } from 'utilities/graph';
// import FormDialog from 'components/FormDialog';
import { sortBy } from 'utilities/sorting';
import QueryGenerator from 'components/QueryGenerator';
// import { Colors } from '@silvergatedelivery/constants';

export default function DataTable({
  data: inData,
  indexes,
  defaultIndex,
  queryDefaultParams = {},
  title = '資料',
  description,
  columns,
  options,
  listQuery,
  queryFunc,
  disableUpdate,
  padding = 16,
  dataSortFunc,
  showQueryGenerator = true,
  ...props
}) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState();
  // const [open, setOpen] = useState(false);
  // const [editItem, setEditItem] = useState();

  const handleUpdate = (items) => {
    setData([...items]);
  };

  useEffect(() => {
    if (inData) {
      setData(inData);
      return;
    }

    (async () => {
      try {
        setIsLoading(true);

        const records = listQuery ? await asyncListAll(listQuery.name, listQuery.params) :
          queryFunc ? await queryFunc() : [];

        setData(records.sort(dataSortFunc ? dataSortFunc : sortBy('createdAt', true)));

        // testing
        if (process.env.NODE_ENV === 'development') {
          // setOpen(true);
          // setEditItem(records[0]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [inData, lastUpdatedAt, listQuery, queryFunc, dataSortFunc]);

  // console.log('indexes', { indexes, queryDefaultParams });

  return (
    <Grid container spacing={1} style={{ padding, display: 'block' }}>
      {indexes && indexes.length > 0 &&
      <Grid item xs={12} >
        <QueryGenerator
          indexes={indexes}
          defaultIndex={defaultIndex}
          defaultParams={queryDefaultParams}
          onUpdate={handleUpdate}
          refreshAt={lastUpdatedAt}
          display={showQueryGenerator}
          appendNewData={true}
        />
      </Grid>}
      <Grid item xs={12}>
        <Table
          title={title}
          isLoading={isLoading}
          description={description}
          data={data}
          columns={columns}
          options={options}
          // onAddItem={() => setOpen(true)}
          // onBatchAdd={onBatchAdd}
          // onUpdateItem={disableUpdate ? undefined : (item)=>{
          //   setOpen(true);
          //   setEditItem(item);
          // }}
          onRefresh={(updatedData) => {
            console.log('onRefresh', updatedData);
            try {
              if (updatedData) {
                const matched = data.find((x) => x.id === updatedData.id);
                if (matched) {
                  Object.assign(matched, updatedData);
                  setData([...data]);
                } else
                if (updatedData.id) {
                  setData([updatedData, ...data]);
                } else {
                  setLastUpdatedAt(Date.now());
                }
              } else {
                setLastUpdatedAt(Date.now());
              }
            } catch (e) {
              setLastUpdatedAt(Date.now());
            }
          }}
          {...props}
        />
      </Grid>
      {/* {open &&
        <FormDialog
          title={title}
          openOnInit={true}
          onClose={() => {
            setOpen(false);
            setEditItem();
          }}
        >
          <props.form
            formData={editItem}
            onComplete={() => {
              setOpen(false);
              setLastUpdatedAt(Date.now());
              setEditItem();
            }}
          />
        </FormDialog>} */}
    </Grid>
  );
}

DataTable.propTypes = {
  data: PropTypes.array,
  indexes: PropTypes.array,
  defaultIndex: PropTypes.number,
  queryDefaultParams: PropTypes.object,
  title: PropTypes.string,
  description: PropTypes.string,
  columns: PropTypes.array,
  options: PropTypes.object,
  listQuery: PropTypes.object,
  queryFunc: PropTypes.func,
  form: PropTypes.func,
  disableUpdate: PropTypes.bool,
  padding: PropTypes.number,
  dataSortFunc: PropTypes.func,
  showQueryGenerator: PropTypes.bool,
};
