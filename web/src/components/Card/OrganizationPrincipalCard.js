import React from 'react';
import PropTypes from 'prop-types';

import InfoCard from './InfoCard';

export default function OrganizationPrincipalCard({ title, data, ...props }) {
  const mappings = [
    { key: 'title', label: '職稱' },
    { key: 'name', label: '姓名' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: '電話' },
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

OrganizationPrincipalCard.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.object,
};
