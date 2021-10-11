import { red } from '@material-ui/core/colors';
import { createTheme, Theme } from '@material-ui/core/styles';

const commonThemeProps = {
  typography: {
    fontFamily: 'Spartan',
  },
};

export const lightTheme: Theme = createTheme({
  ...commonThemeProps,
  palette: {
    type: 'light',
    primary: {
      main: '#121D59',
      light: '#4f96d8',
      dark: '#E5E5E5',
    },
    secondary: {
      main: '#A0D1FB',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#FFFFFF',
      paper: '#d1d1d1',
    },
    text: {
      primary: '#000000',
      secondary: '#121D59',
    },
    action: {
      active: '#390099',
      selected: '#9E0059',
    },
  },
});

export const darkTheme: Theme = createTheme({
  ...commonThemeProps,
  palette: {
    type: 'dark',
    primary: {
      main: '#A0D1FB',
      light: '#E5E5E5',
      dark: '#121D59',
    },
    secondary: {
      main: '#4f96d8',
      dark: '#121d59',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#000000',
      paper: '#424242',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A0D1FB',
    },
    action: {
      active: '#7BA4DB',
      selected: '#CCA1A6',
    },
  },
});
