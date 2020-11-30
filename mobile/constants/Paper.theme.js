import { DefaultTheme } from 'react-native-paper';
import Colors from './Colors';
export default {
  ...DefaultTheme,
  roundness: 0,
  colors: Object.assign(DefaultTheme.colors, {
    primary: Colors.primary,
    accent: Colors.accent,
    background: '#f6f6f6',
    surface: 'white',
    error: Colors.error,
    text: Colors.dark,
    onBackground: '#000000',
    onSurface: '#000000',
    // disabled: color(black)
    //   .alpha(0.26)
    //   .rgb()
    //   .string(),
    // placeholder: color(black)
    //   .alpha(0.54)
    //   .rgb()
    //   .string(),
    // backdrop: color(black)
    //   .alpha(0.5)
    //   .rgb()
    //   .string(),
    // notification: pinkA400,

  }),
  fonts: {
    ...DefaultTheme.fonts,
  }
};
