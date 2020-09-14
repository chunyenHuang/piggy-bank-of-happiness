const { processEventRecords } = require('./helpers');
const { updateEvents } = require('./opt/ddb');

exports.handler = (event) => {
  console.log(event.Records);

  const changeItems = processEventRecords(event.Records);
  console.log(changeItems);

  return updateEvents(changeItems);
};
