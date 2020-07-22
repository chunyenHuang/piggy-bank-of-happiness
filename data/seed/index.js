const fs = require('fs');
const csvtojson = require('csvtojson');
const path = require('path');

const prompt = require('../prompt');
const { writeData } = require('../helper');

(async () => {
  try {
    const {
      tableNames,
    } = await prompt();
    const sourceDir = path.join(__dirname, 'source');
    const sources = fs.readdirSync(sourceDir).filter((x) => x.endsWith('.csv'));

    const promises = sources.map(async (source) => {
      const data = await csvtojson({ checkType: true }).fromFile(path.join(sourceDir, source));

      const typeName = source.replace('.csv', '');
      const tableName = tableNames.find((x) => x.startsWith(`${typeName}-`));
      writeData(tableName, typeName, data);
    });
    await Promise.all(promises);
  } catch (e) {
    console.log(e);
  }
})();
