import { createMuiTheme } from '@material-ui/core';
import { red } from '@material-ui/core/colors';

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#303030',
    },
    secondary: {
      main: '#4f96d8',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#121212',
    },
    text: {
      primary: '#E5E5E5',
      secondary: '#a4c8e9',
      link: '#a4c8e9',
      visited: 'pink',
      default: '#e5e5e5',
    },
  },
});

export default darkTheme;
