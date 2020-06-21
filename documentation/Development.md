# Development

## GetStarted

```bash
npm install -g expo-cli @aws-amplify/cli

npm i
expo start
expo start --reset-cache # if you have package caching issue
```

## AWS Console

https://piggybankofhappiness.signin.aws.amazon.com/console

Please contact John for AWS credentials.

## Amplify

https://docs.amplify.aws/start/q/integration/react-native

```bash
amplify configure
# region: `ap-southeast-1` Asia Pacific (Singapore)
```

## GraphQL

```bash
# support @auto
# https://github.com/hirochachacha/graphql-auto-transformer#4-export-node_path
export NODE_PATH=./node_modules

# compile
amplify api gql-compile
```

Change `@key`
- Comment out `@model` (remove table)
- Push and add the `@model` back

## Social Login

https://docs.amplify.aws/lib/auth/social/q/platform/js#setup-frontend
