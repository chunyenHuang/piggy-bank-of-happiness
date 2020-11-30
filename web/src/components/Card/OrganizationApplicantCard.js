import React from 'react';
import PropTypes from 'prop-types';

import InfoCard from './InfoCard';

export default function OrganizationApplicantCard({ title, data, ...props }) {
  const mappings = [
    { key: 'username', label: '帳號' },
    { key: 'name', label: '姓名' },
    { key: 'email', label: 'Email' },
  ];

  return (
    <InfoCard
      title={title}
      mappings={mappings}
      data={data}
      link={false}
      {...props}
    />
  );
}

OrganizationApplicantCard.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.object,
};
