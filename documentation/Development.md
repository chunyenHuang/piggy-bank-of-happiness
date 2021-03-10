# Development

## GetStarted

Install expo and Amplify CLI. Because we're installing them globally, you might need to run the command below with sudo.
```bash
npm install -g expo-cli
# If expo command not found after installation, install it again
npm install -g @aws-amplify/cli
```

Install packages
```bash
npm install
```

## AWS Console

https://piggybankofhappiness.signin.aws.amazon.com/console

Please contact John for an AWS IAM user account, credentials, and a backend environment for development

## Amplify

https://docs.amplify.aws/start/q/integration/react-native

Configure Amplify by running the following command:
```bash
amplify configure
? region:  ap-southeast-1
? user name:  # User name for IAM user
? accessKeyId:  # AWS credentials
? secretAccessKey:  # AWS credentials
? Profile Name:  piggybankofhappiness
```
Login Amplify Console, select YOUR backend environment, the command below will be found in 'Edit Backend'. Make updates by running the command from the root of your project folder.
```bash
amplify pull --appId XXXXXXXX --envName xxxx
? Do you want to use an AWS profile? Yes
? Please choose the profile you want to use piggybankofhappiness
? Choose your default editor: Visual Studio Code
? Choose the type of app that you're building javascript
? What javascript framework are you using react-native
? Source Directory Path:  /
? Distribution Directory Path: /
? Build Command:  npm run-script build
? Start Command: npm run-script start
Skip auth related questions by input arbitrary value
```

```bash
amplify env checkout ${ENV}
? Do you want to use an AWS profile? Yes
? Please choose the profile you want to use piggybankofhappiness-XXX
✔ Initialized provider successfully.

# You've opted to allow users to authenticate via Facebook.  If you haven't already, you'll need to go to https://developers.facebook.com and create an App ID.

Enter your Facebook App ID for your OAuth flow:  n/a
Enter your Facebook App Secret for your OAuth flow:  n/a

# You've opted to allow users to authenticate via Google.  If you haven't already, you'll need to go to https://developers.google.com/identity and create an App ID.
Enter your Google Web Client ID for your OAuth flow:  n/a
Enter your Google Web Client Secret for your OAuth flow:  n/a

Initialized your environment successfully.
```

### Issues

> Resource is not in the state stackUpdateComplete
> An error occurred during the push operation: Resource is not in the state stackUpdateComplete

```bash
amplify -y --force
```

## Build Test Environment

```
cd data
npm install
npm run seed:test
npm run user:add
```

## Start Expo

```bash
expo start
expo start --reset-cache # if you have package caching issue
```
