export const formatAddress = (inAddressObject) => {
  if (!inAddressObject) return '';
  const {
    address1,
    address2,
    city,
    state,
    postalCode,
    extendedPostalCode,
  } = inAddressObject;

  return [
    `${address1 ? address1 : ''}`,
    `${address2 ? ` ${address2}` : ''}`,
    `${city ? `, ${city}` : ''}`,
    `${state ? `, ${state}` : ''}`,
    `${postalCode ? ` ${postalCode}` : ''}`,
    `${extendedPostalCode ? `-${extendedPostalCode}` : ''}`,
  ].join('');
};
