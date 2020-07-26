// https://github.com/aws-amplify/amplify-js/blob/master/packages/aws-amplify-react-native/src/AmplifyTheme.js
// https://github.com/aws-amplify/amplify-js/blob/master/packages/aws-amplify-react-native/src/AmplifyTheme.js

import Colors from '../constants/Colors';

// Colors
export const deepSquidInk = '#152939';
export const linkUnderlayColor = '#FFF';
export const errorIconColor = '#DD3F9B';
export const primaryColor = Colors.primary;

// Theme
export default {
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 20,
    width: '100%',
    backgroundColor: '#FFF',
  },
  section: {
    flex: 1,
    width: '100%',
    padding: 20,
  },
  sectionHeader: {
    width: '100%',
    marginBottom: 32,
  },
  sectionHeaderText: {
    color: deepSquidInk,
    fontSize: 20,
    fontWeight: '500',
  },
  sectionFooter: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 20,
  },
  sectionFooterLink: {
    fontSize: 14,
    color: primaryColor,
    alignItems: 'baseline',
    textAlign: 'center',
  },
  navBar: {
    marginTop: 35,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  navButton: {
    marginLeft: 12,
    borderRadius: 4,
  },
  cell: {
    flex: 1,
    width: '50%',
  },
  errorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  errorRowText: {
    marginLeft: 10,
  },
  photo: {
    width: '100%',
  },
  album: {
    width: '100%',
  },
  button: {
    backgroundColor: primaryColor,
    alignItems: 'center',
    padding: 16,
  },
  buttonDisabled: {
    backgroundColor: primaryColor,
    opacity: 0.5,
    alignItems: 'center',
    padding: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  formField: {
    marginBottom: 22,
  },
  input: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#C4C4C4',
  },
  inputLabel: {
    marginBottom: 8,
  },
  phoneContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneInput: {
    flex: 2,
    padding: 16,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#C4C4C4',
  },
  picker: {
    flex: 1,
    height: 44,
  },
  pickerItem: {
    height: 44,
  },
};
