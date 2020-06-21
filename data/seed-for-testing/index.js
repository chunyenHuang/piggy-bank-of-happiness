// const uuidv1 = require('uuid/v1');
const csvtojson = require('csvtojson');
const path = require('path');

const prompt = require('../prompt');
const { purgeTable, writeData } = require('../helper');

const tables = [{
  name: 'Organization',
  partitionKey: 'id',
  sortKey: null,
  source: 'organizations.csv',
  dataFunc: (item) => item,
}, {
  name: 'OrganizationTask',
  partitionKey: 'organizationId',
  sortKey: 'name',
  source: 'organization_tasks.csv',
  dataFunc: (item) => item,
}];

(async () => {
  try {
    const {
      env: ENV,
      hash: HASH,
      shouldPurge: PURGE,
    } = await prompt();
    await tables.map(async ({ name, partitionKey, sortKey, source, dataFunc }) => {
      if (PURGE) {
        await purgeTable(HASH, ENV, name, partitionKey, sortKey);
      }

      const data = (await csvtojson({ checkType: true }).fromFile(path.join(__dirname, 'source', source))).map(dataFunc);
      console.log(data);
      await writeData(HASH, ENV, name, data);
    });
  } catch (e) {
    console.log(e);
  }
})();
