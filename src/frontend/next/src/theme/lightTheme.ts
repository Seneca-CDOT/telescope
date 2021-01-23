import { red } from '@material-ui/core/colors';
import createMuiTheme, { Theme } from '@material-ui/core/styles/createMuiTheme';

const lightTheme: Theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#333E64',
      contrastText: '#E5E5E5',
      light: '#FFFFFF',
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
      primary: '#181818',
      secondary: '#8BC2EB',
    },
  },
});

export default lightTheme;
