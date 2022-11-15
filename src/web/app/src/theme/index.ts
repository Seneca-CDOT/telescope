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
      light: '#4d4d4d',
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
      active: '#1A73E8',
      selected: '#9E0059',
    },
    border: {
      main: 'rgba(27,31,36,0.15)',
    },
    info: {
      main: '#121D59',
      light: '#123B67',
    },
  },
});

export const lightHighContrastTheme: Theme = createTheme({
  ...commonThemeProps,
  palette: {
    type: 'light',
    primary: {
      main: '#050133',
      light: '#1364D8',
      dark: '#B7B7B6',
    },
    secondary: {
      main: '#30A5FC',
    },
    error: {
      main: '#C4051C',
      light: '#195E02',
    },
    background: {
      default: '#FFFFFF',
      paper: '#D1D1D1',
    },
    text: {
      primary: '#000000',
      secondary: '#050133',
    },
    action: {
      active: '#03407C',
      selected: '#9B0494',
    },
    border: {
      main: 'rgba(240,246,252,0.5)',
    },
    info: {
      main: '#050133',
      light: '#01333F ',
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
    border: {
      main: 'rgba(240,246,252,0.1)',
    },
    info: {
      main: '#a0d1fb',
      light: '#228CB6',
    },
  },
});

export const darkDimTheme: Theme = createTheme({
  ...commonThemeProps,
  palette: {
    type: 'dark',
    primary: {
      main: '#85ADC6',
      light: '#C4C4BC',
      dark: '#2D3860',
    },
    secondary: {
      main: '#3F769E',
      dark: '#2D3860',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#1E1E1E',
      paper: '#424243',
    },
    text: {
      primary: '#CCCACA',
      secondary: '#85ADC6',
    },
    action: {
      active: '#5A799B',
      selected: '#B2767E',
    },
    border: {
      main: 'rgba(240,246,252,0.3)',
    },
    info: {
      main: '#8CB2C4',
      light: '#3C8399',
    },
  },
});
