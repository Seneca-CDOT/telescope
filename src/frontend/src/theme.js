import { red } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

// TODO: this needs to be fixed for our needs...
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#335A7E',
    },
    secondary: {
      main: '#3670a5',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#2e2e2e',
    },
  },
});

export default theme;
