// #2189DC
// #C4E0AD #89C9A3 #68b386 #439463
// #242424 #363636 #424242 #888889

const primary = '#68b386';
const accent = '#f8aa5d';
const raised = '#f05a5a';
const focused = '#439463';
const error = 'red';

const dark = '#363636';
const light = '#888889';
const highlight = '#f7f7f7';

export default {
  useDark: true,
  primary,
  accent,
  raised,
  focused,

  // text
  primaryText: dark,
  secondaryText: light,
  light,
  dark,
  highlight,

  tintColor: primary,
  tabIconDefault: light,
  tabIconSelected: focused,
  tabBar: primary,
  error,
  errorBackground: error,
  errorText: '#fff',
  warningBackground: accent,
  warningText: '#666804',
  noticeBackground: primary,
  noticeText: '#fff',
};
