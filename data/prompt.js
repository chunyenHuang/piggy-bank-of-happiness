const inquirer = require('inquirer');
const AWS = require('aws-sdk');

const { AWS_PROFILE, AWS_REGION } = require('./config');
const currentCloudBackendConfig = require('../amplify/#current-cloud-backend/amplify-meta.json');

const credentials = new AWS.SharedIniFileCredentials({ profile: AWS_PROFILE });
AWS.config.credentials = credentials;
const config = {
  region: AWS_REGION,
};
const appsync = new AWS.AppSync(config);

module.exports = async () => {
  const env = currentCloudBackendConfig.providers.awscloudformation.AuthRoleName.split('-')[2];

  console.log('Switch environment: amplify env checkout {{ENV}}');
  const { profile, region, confirm } = await inquirer.prompt([
    { name: 'profile', message: `AWS Credentials Profile: ${AWS_PROFILE}`, type: 'confirm', default: true },
    { name: 'region', message: `AWS Region: ${AWS_REGION}`, type: 'confirm', default: true },
    { name: 'confirm', message: `Continue for env: ${env}?`, type: 'confirm', default: false },
  ]);

  if (!profile || !region || !confirm) {
    return process.exit(0);
  }

  if (['prd', 'production', 'master'].includes(env)) {
    console.log('Do not run this in production');
    return process.exit(0);
  }

  const apiId = currentCloudBackendConfig.api.piggybankofhappiness.output.GraphQLAPIIdOutput;

  if (!apiId) {
    console.log('Missing apiId in #current-cloud-backend/amplify-meta.json');
    return process.exit(1);
  }

  const { dataSources } = await appsync.listDataSources({ apiId }).promise();
  const tableNames = dataSources
    .filter(({ dynamodbConfig }) => dynamodbConfig)
    .map(({ dynamodbConfig }) => dynamodbConfig.tableName);

  if (tableNames.length === 0) {
    console.log('Can not find any table for this environment.');
    return process.exit(1);
  }

  return {
    env,
    tableNames,
  };
};
