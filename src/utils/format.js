import 'intl';
import 'intl/locale-data/jsonp/en';

export const currency = (inCents, inPrefix = '') => {
  return `${inPrefix}${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(inCents/100)}`;
};

export const shortString = (inString, inMaxLength = 100) => {
  return inString.replace(/\r?\n|\r/g, ' ').substring(0, inMaxLength) +
    ((inString.length > inMaxLength ? '...' : ''));
};
