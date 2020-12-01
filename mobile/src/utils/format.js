import 'intl';
import 'intl/locale-data/jsonp/en';

const LOCALE = 'zh-TW';
const TIME_ZONE = 'Asia/Taipei';

export const currency = (inCents, withPrefix = true) => {
  const prefix = withPrefix && inCents >= 0 ? '+' : '';
  return `${prefix}${(new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(inCents/100)).replace('$', '').replace('.00', '')}`;
};

export const shortString = (inString, inMaxLength = 100) => {
  return inString.replace(/\r?\n|\r/g, ' ').substring(0, inMaxLength) +
    ((inString.length > inMaxLength ? '...' : ''));
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
