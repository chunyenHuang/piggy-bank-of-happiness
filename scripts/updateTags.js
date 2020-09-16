const fs = require('fs');
const path = require('path');

const tagsFilePath = path.join(__dirname, '../amplify/backend/tags.json');

const { AWS_BRANCH = '' } = process.env;

console.log(`AWS_BRANCH: ${AWS_BRANCH}`);

let env;
switch (AWS_BRANCH.toLowerCase()) {
case 'master':
case 'production':
case 'prd':
  env = 'prd';
  break;
case 'release':
case 'staging':
case 'stg':
  env = 'stg';
  break;
default:
  env = 'dev';
  break;
}

// Replace tags with simplified environment
const tags = [{
  Key: 'Environment',
  Value: env,
}, {
  Key: 'Product',
  Value: '幸福存摺',
}, {
  Key: 'Branch',
  Value: AWS_BRANCH,
}];

fs.writeFileSync(tagsFilePath, JSON.stringify(tags, null, 2));
