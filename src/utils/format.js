import 'intl';
import 'intl/locale-data/jsonp/en';

export const currency = (inCents, withPrefix = true) => {
  const prefix = withPrefix && inCents >= 0 ? '+' : '';
  return `${prefix}${(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(inCents/100)).replace('$', '').replace('.00', '')}`;
};

export const shortString = (inString, inMaxLength = 100) => {
  return inString.replace(/\r?\n|\r/g, ' ').substring(0, inMaxLength) +
    ((inString.length > inMaxLength ? '...' : ''));
};
