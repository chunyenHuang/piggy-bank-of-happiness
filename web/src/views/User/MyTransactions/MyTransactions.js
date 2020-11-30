import React, { useEffect, useState } from 'react';

import OrganizationTransactionTable from 'components/OrganizationTransactionTable';
import { getTransactionsByUserByCreatedAt } from 'graphql/queries';
import { asyncListAll } from 'utilities/graph';
import { sortBy } from 'utilities/sorting';

export default function MyTransactions() {
  const [data, setData] = useState([]);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(0);

  useEffect(() => {
    (async () => {
      const username = localStorage.getItem('app:username') || '';
      const params = { username };

      const records = (await asyncListAll(getTransactionsByUserByCreatedAt, params));
      setData(records.sort(sortBy('createdAt', true)));
    })();
  }, [lastUpdatedAt]);

  return (
    <OrganizationTransactionTable
      title="交易紀錄"
      data={data}
      onRefresh={()=>setLastUpdatedAt(Date.now())}
    />
  );
}
