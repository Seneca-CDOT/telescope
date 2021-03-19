import { IconButton, Tooltip, Zoom } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';

import { useTheme } from './ThemeProvider';

const useStyles = makeStyles((theme) => ({
  themeToggleButton: {
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.text.primary,
    },
  },
}));

const ButtonTooltip = withStyles({
  tooltip: {
    fontSize: '1.5rem',
    margin: 0,
  },
})(Tooltip);

const ThemeToggleButton = () => {
  const classes = useStyles();
  const { themeName, toggleTheme } = useTheme();

  return (
    <ButtonTooltip title="Toggle Light/Dark Theme" arrow placement="top" TransitionComponent={Zoom}>
      <IconButton onClick={toggleTheme} className={classes.themeToggleButton}>
        {themeName === 'light' ? (
          <Brightness4Icon fontSize="large" />
        ) : (
          <Brightness7Icon fontSize="large" />
        )}
      </IconButton>
    </ButtonTooltip>
  );
};

export default ThemeToggleButton;
