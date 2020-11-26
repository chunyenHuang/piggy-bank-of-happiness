/* eslint-disable no-tabs */
/* Amplify Params - DO NOT EDIT
	API_PIGGYBANKOFHAPPINESS_GRAPHQLAPIIDOUTPUT
	API_PIGGYBANKOFHAPPINESS_ORGANIZATIONTABLE_ARN
	API_PIGGYBANKOFHAPPINESS_ORGANIZATIONTABLE_NAME
	API_PIGGYBANKOFHAPPINESS_ORGANIZATIONUSERTABLE_ARN
	API_PIGGYBANKOFHAPPINESS_ORGANIZATIONUSERTABLE_NAME
	AUTH_PIGGYBANKOFHAPPINESSCF2E2C90_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */

const resolvers = require('./resolvers');

exports.handler = async (event) => {
  console.log(event);
  const { typeName, fieldName } = event;
  const typeHandler = resolvers[typeName];
  if (typeHandler) {
    const resolver = typeHandler[fieldName];
    if (resolver) {
      try {
        return resolver(event);
      } catch (e) {
        console.log(e);
        throw new Error(e);
      }
    }
  }
  throw new Error(`Resolver ${typeName}/${fieldName} not found.`);
};
