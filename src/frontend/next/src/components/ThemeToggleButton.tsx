import { IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';

import { useTheme } from './ThemeProvider';

const useStyles = makeStyles((theme) => ({
  themeToggleButton: {},
  themeIcon: {
    color: theme.palette.primary.contrastText,
  },
}));

const ThemeToggleButton = () => {
  const classes = useStyles();
  const { themeName, toggleTheme } = useTheme();

  return (
    <IconButton onClick={toggleTheme} className={classes.themeToggleButton}>
      {themeName === 'light' ? (
        <Brightness4Icon fontSize="large" className={classes.themeIcon} />
      ) : (
        <Brightness7Icon fontSize="large" className={classes.themeIcon} />
      )}
    </IconButton>
  );
};

export default ThemeToggleButton;
