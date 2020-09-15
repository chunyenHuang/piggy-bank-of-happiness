const docClient = require('./docClient');

const {
  API_PIGGYBANKOFHAPPINESS_EVENTTABLE_NAME,
} = process.env;

module.exports = {
  async updateEvents(events = []) {
    if (events.length === 0) return;

    return docClient.batchUpdate(API_PIGGYBANKOFHAPPINESS_EVENTTABLE_NAME, events, 300);
  },
};
