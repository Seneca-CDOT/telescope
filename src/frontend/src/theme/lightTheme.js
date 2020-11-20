import { createMuiTheme } from '@material-ui/core';
import { red } from '@material-ui/core/colors';

const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#333E64',
    },
    secondary: {
      main: '#0589D6',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#E5E5E5',
    },
    text: {
      primary: '#E5E5E5',
      secondary: '#35b4ff',
      link: '#034e7a',
      visited: 'purple',
      default: '#181818',
    },
  },
});

export default lightTheme;
