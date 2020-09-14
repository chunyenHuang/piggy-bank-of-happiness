const aws = require('aws-sdk');

const MAX_EVENT_AGE_SECONDS = 10 * 60; // 10 minutes

module.exports = {
  compareObjects,
  /**
   * processEventRecords
   * @param {Array} inRecords
   * @return {Array} changeItems
   */
  processEventRecords(inRecords = []) {
    const changeItems = [];
    inRecords.forEach((record, index) => {
      const {
        eventID,
        eventName,
        eventSourceARN,
      } = record;

      const {
        ApproximateCreationDateTime,
        Keys,
        NewImage,
        OldImage,
      } = record.dynamodb;

      const eventAge = (new Date().valueOf() / 1000 - ApproximateCreationDateTime);
      if (eventAge > MAX_EVENT_AGE_SECONDS) {
        console.log(`Event age: ${eventAge} is greater than ${MAX_EVENT_AGE_SECONDS}`);
      }

      const arnArrays = eventSourceARN.split('/');
      const tableName = arnArrays[1];

      const parsedNewData = NewImage ? aws.DynamoDB.Converter.unmarshall(NewImage) : undefined;
      const parsedOldData = OldImage ? aws.DynamoDB.Converter.unmarshall(OldImage) : undefined;

      const diff = compareObjects(parsedOldData, parsedNewData);
      const partitionKey = Object.keys(Keys)[0];
      const sortKey = Object.keys(Keys)[1];

      console.log({ partitionKey, sortKey });

      const partitionKeyValue = (parsedNewData || parsedOldData)[partitionKey];
      const sortKeyValue = sortKey ? (parsedNewData || parsedOldData)[sortKey] : undefined;

      // ApproximateCreationDateTime is not accurate enough when using batchWindow
      // use the updatedAt if possible
      const timestamp = parsedNewData && parsedNewData.updatedAt ?
        parsedNewData.updatedAt :
        new Date(ApproximateCreationDateTime * 1000 + index).toISOString();

      // organizationId?
      const organizationId = (parsedOldData || parsedNewData).organizationId;
      const updatedBy = (parsedOldData || parsedNewData).updatedBy;

      const now = new Date().toISOString();

      const changeItem = {
        key: `${tableName}__${partitionKeyValue}__${sortKeyValue}`,
        timestamp,
        organizationId,
        updatedBy,
        eventId: eventID,
        eventName: eventName,
        diff,
        createdAt: now,
        updatedAt: now,
      };

      changeItems.push(changeItem);
    });

    return changeItems;
  },
};

/**
 * compareObjects
 * @param {Object} inOldObj
 * @param {Object} inNewObj
 * @return {Array} Diff
 */
function compareObjects(inOldObj = {}, inNewObj = {}) {
  if (Object.keys(inOldObj).length === 0 || Object.keys(inNewObj).length === 0) {
    return [];
  }

  const diff = [];
  const keys = [];
  Object.keys(inOldObj).forEach((key) => {
    if (!keys.includes(key)) {
      keys.push(key);
    }
  });
  Object.keys(inNewObj).forEach((key) => {
    if (!keys.includes(key)) {
      keys.push(key);
    }
  });
  keys.forEach((key) => {
    let oldData = inOldObj[key];
    let newData = inNewObj[key];
    try {
      oldData = JSON.stringify(oldData);
    } catch (e) {
      //
    }
    try {
      newData = JSON.stringify(newData);
    } catch (e) {
      //
    }

    if (oldData !== newData) {
      diff.push({
        key,
        old: oldData,
        new: newData,
      });
    }
  });

  return diff;
}
