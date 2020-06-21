/**
 * sort array by field
 * @param {String} inField
 * @param {Boolean} inReverse
 * @return {Function};
 */
export function sortBy(inField, inReverse = false) {
  return (a, b) => {
    const val = (!inReverse) ? 1 : -1;
    if ((a[inField] === b[inField])) return 0;
    return (a[inField] > b[inField]) ? 1 * val : 1 * -val;
  };
}
