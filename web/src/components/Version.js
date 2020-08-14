import React from 'react';
import Typography from '@material-ui/core/Typography';

import amplifyConfig from '../aws-exports';
import appConfig from '../../package.json';

export default function Version() {
  const version = appConfig.version;
  const envName = amplifyConfig.aws_cloud_logic_custom[0].endpoint.split('/').pop();

  const isPrd = envName === 'prd' || process.env.NODE_ENV !== 'development';

  const env = isPrd ? '' : envName;

  return (
    <Typography component="p" variant="body1" color="inherit" noWrap>
      v{version} {env ? `(${env})` : ''}
    </Typography>
  );
}
