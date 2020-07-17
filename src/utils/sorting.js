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
    return val * (new Intl.Collator('zh', { numeric: true, sensitivity: 'base' }).compare(a[inField], b[inField]));
  };
}
