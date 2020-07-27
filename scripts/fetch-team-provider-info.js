const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../amplify/team-provider-info.json')

const region = 'ap-southeast-1';
const secretName = 'piggybank-team-provider-info';

const {
    AWS_PROFILE
} = process.env;

if (AWS_PROFILE) {
    const credentials = new AWS.SharedIniFileCredentials({
        profile: AWS_PROFILE
    });
    AWS.config.credentials = credentials;
}

const client = new AWS.SecretsManager({
    region: region
});

(async () => {
    if (fs.existsSync(filePath)) {
        return console.log(`${filePath} exists`);
    }
    const {
        SecretString
    } = await client.getSecretValue({
        SecretId: secretName
    }).promise();

    const data = JSON.parse(SecretString);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
})();