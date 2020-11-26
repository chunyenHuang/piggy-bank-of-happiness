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
    return matched ? matched.label : inValue;
  };
};
