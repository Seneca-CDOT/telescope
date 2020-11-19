import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// TODO: this needs to be fixed for our needs...
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#333E64',
      contrastText: '#E5E5E5',
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

export default theme;
