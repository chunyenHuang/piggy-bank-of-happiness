import React from 'react';
import PropTypes from 'prop-types';

import orgApplicationStatusMenu from 'constants/orgApplicationStatus';
import orgIsActiveMenu from 'constants/orgIsActive';
import { formatAddress, renderFromMenu } from 'utilities/format';
import InfoCard from './InfoCard';

export default function OrganizationCard({ title, data, ...props }) {
  const mappings = [
    { key: 'status', label: '申請狀態', format: renderFromMenu(orgApplicationStatusMenu) },
    { key: 'isActive', label: '使用狀態', format: renderFromMenu(orgIsActiveMenu) },

    { key: 'id', label: 'ID' },
    { key: 'name', label: '名稱' },
    { key: 'registeredName', label: '立案名稱' },
    { key: 'description', label: '描述' },
    { key: 'taxIdNumber', label: '統一編號' },
    { key: 'email', label: 'Email' },
    { key: 'phoneNumber', label: '電話' },
    { key: 'faxNumber', label: 'FAX' },

    { key: 'address', label: '地址', format: formatAddress },
  ];

  return (
    <InfoCard
      title={title}
      mappings={mappings}
      data={data}
      link={data.id ? `/organization/${data.id}` : null}
      {...props}
    />
  );
}

OrganizationCard.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  data: PropTypes.object,
};
