const exec = require('child_process').exec;

const teamInfo = require('../amplify/team-provider-info.json');

const {
    AWS_BRANCH
} = process.env;

const envInfo = teamInfo[AWS_BRANCH];
if (!envInfo) {
    console.log(`Can not find env ${AWS_BRANCH} in team-provider-info.json`);
    return process.exit(1);
}

const creds = JSON.parse(envInfo.categories.auth.piggybankofhappinesscf2e2c90.hostedUIProviderCreds)
console.log(creds);

const {
    client_id: facebookAppIdUserPool,
    client_secret: facebookAppSecretUserPool
} = creds.find(({
    ProviderName
}) => ProviderName === 'Facebook');

const {
    client_id: googleAppIdUserPool,
    client_secret: googleAppSecretUserPool
} = creds.find(({
    ProviderName
}) => ProviderName === 'Google');

const authConfig = {
    auth: {
        facebookAppIdUserPool,
        facebookAppSecretUserPool,
        googleAppIdUserPool,
        googleAppSecretUserPool,
    }
}

const commands = [
    'amplify init',
    `--amplify "{\\"envName\\":\\"${AWS_BRANCH}\\"}"`,
    `--categories "${JSON.stringify(authConfig).replace(/"/g, '\\"')}"`,
    '--yes',
];

console.log(commands.join(' '));

const event = exec(commands.join(' '));

event.stdout.on('data', console.log);
event.stderr.on('data', console.log);

event.on('exit', process.exit);