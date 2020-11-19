import React from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import PropTypes from 'prop-types';

export default function TopLayout(props) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  // Color Overrides
  const primaryMainColor = prefersDarkMode ? '#303030' : '#333E64';
  const secondaryMainColor = prefersDarkMode ? '#4f96d8' : '#0589D6';
  const backgroundMainColor = prefersDarkMode ? '#121212' : '#E5E5E5';
  const textDefaultColor = prefersDarkMode ? '#e5e5e5' : '#181818';
  const textVisitedLinkColor = prefersDarkMode ? 'pink' : 'purple';

  const theme = createMuiTheme({
    palette: {
      type: prefersDarkMode ? 'dark' : 'light',
      primary: {
        main: primaryMainColor,
      },
      secondary: {
        main: secondaryMainColor,
      },
      error: {
        main: red.A400,
      },
      background: {
        default: backgroundMainColor,
      },
      text: {
        primary: '#E5E5E5',
        secondary: secondaryMainColor,
        visited: textVisitedLinkColor,
        default: textDefaultColor,
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </>
  );
}

TopLayout.propTypes = {
  children: PropTypes.node,
};
