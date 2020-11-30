import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import moment from 'moment';
import DetailForm from 'react-material-final-form';

import { request } from 'utilities/graph';
import { getOrganization } from 'graphql/queries';
import { updateOrganization } from 'graphql/mutations';

const metadata = {
  fields: [{
    key: 'id',
    type: 'string',
    label: 'ID',
    isRequired: true,
    isDisabled: true,
    isHidden: false,
  }, {
    key: 'name',
    type: 'string',
    label: '名稱',
    isRequired: true,
    isDisabled: true,
  }, {
    key: 'description',
    type: 'textarea',
    label: '描述',
    isRequired: false,
  }, {
    key: 'isActive',
    type: 'number',
    label: '狀態',
    isRequired: true,
    formType: 'Radio',
    formOptions: [
      { label: '使用中', value: 1 },
      { label: '停用中', value: 0 },
    ],
  }],
};

export default function OrganizationProfile({ id, data: inData }) {
  const [data, setData] = useState(inData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = async (newData) => {
    setIsSubmitting(true);

    const now = moment().toISOString();
    newData.updatedAt = now;
    newData.updatedBy = localStorage.getItem('app:username');

    await request(updateOrganization, { input: newData });

    setIsSubmitting(false);
    setData(newData);
  };

  useEffect(() => {
    (async () => {
      if (id) {
        const { data: { getOrganization: data } } = await request(getOrganization, { id });
        setData(data);
      }
    })();
  }, [id]);

  if (!data) return null;

  return (
    <Box p={2}>
      <DetailForm
        // title={'Sign Up'}
        metadata={metadata}
        data={data}
        isLoading={isSubmitting}
        onSubmit={update}
        submitButtonText={'更新'}
        submitButtonProps={{
          variant: 'contained',
          color: 'primary',
          type: 'submit',
          fullWidth: false,
        }}
      />
    </Box>
  );
}

OrganizationProfile.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
};
