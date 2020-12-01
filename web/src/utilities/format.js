import React from 'react';
import Box from '@material-ui/core/Box';

const LOCALE = 'zh-TW';
const TIME_ZONE = 'Asia/Taipei';

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


export const formatDatetime = (inDatetime, options = {}) => {
  if (!inDatetime) return '';

  const {
    year = true, day = true, weekday = false,
  } = options;

  return new Date(inDatetime).toLocaleString(LOCALE, {
    timeZone: TIME_ZONE,
    weekday: weekday ? 'long' : undefined,
    year: year ? 'numeric' : undefined,
    month: 'short',
    day: day ? 'numeric' : undefined,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
