import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core';
import getThemeByBool from './themeMap';

export const ThemeContext = React.createContext(() => {});

export default function CustomThemeProvider(props) {
  const [darkTheme, setDarkTheme] = useState(false);

  function handleSetTheme() {
    setDarkTheme(!darkTheme);
  }

  const theme = getThemeByBool(darkTheme);

  return (
    <ThemeContext.Provider value={handleSetTheme}>
      <MuiThemeProvider theme={theme}>{props.children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

CustomThemeProvider.propTypes = {
  children: PropTypes.node,
};
