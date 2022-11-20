// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react';
import {
  IconButton,
  Popover,
  Typography,
  Paper,
  Tooltip,
  Zoom,
  Divider,
  MenuList,
  MenuItem,
  ListItemText,
} from '@material-ui/core';
import { List, ListSubheader } from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { useTheme } from './ThemeProvider';
import {
  Theme,
  ThemeName,
  LIGHT_DEFAULT,
  LIGHT_HIGH_CONTRAST,
  DARK_DEFAULT,
  DARK_DIM,
} from '../interfaces/index';

const lightDefaultLogoUrl = '/colorThemes/light-default.png';
const darkDefaultLogoUrl = '/colorThemes/dark-default.png';
const lightContrastLogoUrl = '/colorThemes/light-high-contrast.png';
const darkDimLogoUrl = '/colorThemes/dark-dim.png';
const themes: Theme[] = [
  { title: 'Light Default', id: LIGHT_DEFAULT, image: lightDefaultLogoUrl },
  { title: 'Light High Contrast', id: LIGHT_HIGH_CONTRAST, image: lightContrastLogoUrl },
  { title: 'Dark Default', id: DARK_DEFAULT, image: darkDefaultLogoUrl },
  { title: 'Dark Dim', id: DARK_DIM, image: darkDimLogoUrl },
];

const useStyles = makeStyles((theme) => ({
  menuSubheader: {
    color: theme.palette.text.primary,
    backgroundColor: 'transparent',
  },
  popoverPaper: {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
  },
  themeSelectButton: {
    '&:hover': {
      color: theme.palette.action.active,
    },
  },
  themeSelectorButton: {
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: 'transparent',
      color: theme.palette.text.primary,
    },
  },
  selected: {
    color: 'black',
    backgroundColor: '#A9A9A9 !important',
  },
}));

const ButtonTooltip = withStyles({
  tooltip: {
    fontSize: '1.5rem',
    margin: 0,
  },
})(Tooltip);

const ThemeSelector = () => {
  const classes = useStyles();
  const { preferredTheme, changeTheme } = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (id: ThemeName): void => {
    changeTheme(id);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <ButtonTooltip
        title="Change Colour Theme"
        arrow
        placement="top"
        TransitionComponent={Zoom}
        onClick={handleClick}
      >
        <IconButton className={classes.themeSelectorButton}>
          <PaletteIcon fontSize="large" />
        </IconButton>
      </ButtonTooltip>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        PaperProps={{
          style: { width: '240px' },
        }}
      >
        <Paper className={classes.popoverPaper}>
          <List>
            <ListSubheader className={classes.menuSubheader}>
              <Typography variant="h6" gutterBottom>
                Change Colour Theme
              </Typography>
            </ListSubheader>
            <Divider />
            <MenuList>
              {themes.map((theme) => {
                return (
                  <MenuItem
                    key={theme.id}
                    onClick={() => handleChange(theme.id)}
                    selected={preferredTheme === theme.id}
                    className={classes.themeSelectButton}
                    classes={{ selected: classes.selected }}
                  >
                    <ListItemText>{theme.title}</ListItemText>
                    <img src={theme.image} className="palette-preview" alt={theme.title} />
                  </MenuItem>
                );
              })}
            </MenuList>
          </List>
        </Paper>
      </Popover>
    </div>
  );
};

export default ThemeSelector;
