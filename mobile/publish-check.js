import awsConfig from './aws-exports';

const env = awsConfig.aws_user_files_s3_bucket.split('-').pop();
const targetReleaseEnv = process.argv[2];

if (env !== targetReleaseEnv) {
  console.log(`${env} does not match the releast channel ${targetReleaseEnv}`);
  process.exit(1);
}
