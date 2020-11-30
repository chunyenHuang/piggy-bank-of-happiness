/* Amplify Params - DO NOT EDIT
	API_PIGGYBANKOFHAPPINESS_EVENTTABLE_ARN
	API_PIGGYBANKOFHAPPINESS_EVENTTABLE_NAME
	API_PIGGYBANKOFHAPPINESS_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */const { processEventRecords } = require('./helpers');
const { updateEvents } = require('./opt/ddb');

exports.handler = (event) => {
  console.log(event.Records);

  const changeItems = processEventRecords(event.Records);
  console.log(changeItems);

  return updateEvents(changeItems);
};
