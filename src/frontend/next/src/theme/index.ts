import { red } from '@material-ui/core/colors';
import createMuiTheme, { Theme } from '@material-ui/core/styles/createMuiTheme';

export const lightTheme: Theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#121D59', // TITLE AND ICONS
      contrastText: '#A0D1FB', // SCROLL TO TOP BACKGROUND
      light: '#FFFFFF',
    },
    secondary: {
      main: '#0589D6',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#E5E5E5', // BACKGROUND
    },
    text: {
      primary: '#000000', // TEXT
      secondary: '#8BC2EB',
    },
  },
});

export const darkTheme: Theme = createMuiTheme({
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
