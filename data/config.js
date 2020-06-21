const { aws_project_region, aws_user_pools_id, aws_cloud_logic_custom } = require('../aws-exports').default;

module.exports = {
  AWS_PROFILE: 'piggybankofhappiness',
  AWS_REGION: aws_project_region || 'ap-southeast-1',
  COGNITO_POOLS_ID: aws_user_pools_id,
  ENV: aws_cloud_logic_custom ? aws_cloud_logic_custom[0].endpoint.split('/').pop() : null,
  DDB: {
    develop: 'bkdckjojs5bb5m2lp3xc5fyrna',
  },
};
