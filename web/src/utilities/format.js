import React from 'react';
import Box from '@material-ui/core/Box';

export const formatAddress = (inAddressObject = {}) => {
  if (typeof inAddressObject === 'string') return inAddressObject;
  const {
    country,
    county,
    district,
    street,
    zipCode,
  } = inAddressObject;
  if (!county) return null;

  return `${country ? `${country} ` : ''}${zipCode || ''} ${county || ''}${district || ''}${street || ''}`;
};

export const renderFromMenu = (inMenu = []) => {
  return (inValue) => {
    const matched = inMenu.find(({ value }) => value === inValue);
    const text = matched ? matched.label : inValue;
    const color = matched ? matched.color : '#000000';

    return (
      <Box component="p" color={color} fontWeight={700}>
        {text}
      </Box>);
  };
};
