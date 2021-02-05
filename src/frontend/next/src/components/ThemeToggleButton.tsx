import { IconButton, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';

const useStyles = makeStyles({
  themeToggleButton: {
    position: 'absolute',
    top: 50,
    right: 10,
  },
});
type Props = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeToggleButton = ({ theme, toggleTheme }: Props) => {
  const classes = useStyles();
  return (
    <IconButton onClick={toggleTheme} className={classes.themeToggleButton}>
      {theme.palette.type === 'light' ? (
        <Brightness4Icon color="primary" fontSize="large" />
      ) : (
        <Brightness7Icon fontSize="large" />
      )}
    </IconButton>
  );
};

export default ThemeToggleButton;
