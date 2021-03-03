import { red } from '@material-ui/core/colors';
import createMuiTheme, { Theme } from '@material-ui/core/styles/createMuiTheme';

const commonThemeProps = {
  typography: {
    fontFamily: 'Spartan',
  },
};

export const lightTheme: Theme = createMuiTheme({
  ...commonThemeProps,
  palette: {
    type: 'light',
    primary: {
      main: '#121D59',
    },
    secondary: {
      main: '#A0D1FB',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#E5E5E5',
    },
    text: {
      primary: '#000000',
      secondary: '#121D59',
    },
  },
});

export const darkTheme: Theme = createMuiTheme({
  ...commonThemeProps,
  palette: {
    type: 'dark',
    primary: {
      main: '#242424',
      contrastText: '#E5E5E5',
      light: '#FFFFFF',
    },
    secondary: {
      main: '#4f96d8',
    },
    error: {
      main: red.A400,
    },
    background: {
      paper: '#303030',
      default: '#121212',
    },
    text: {
      primary: '#E5E5E5',
      secondary: '#4f96d8',
    },
  },
});
