import { useEffect } from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider, Theme } from '@material-ui/core/styles';
import { SWRConfig } from 'swr';
import { ThemeContext } from '../components/ThemeProvider';
import {
  ThemeName,
  LIGHT_DEFAULT,
  LIGHT_HIGH_CONTRAST,
  DARK_DEFAULT,
  DARK_DIM,
} from '../interfaces/index';
import AuthProvider from '../components/AuthProvider';
import usePreferredTheme from '../hooks/use-preferred-theme';
import { darkTheme, lightTheme, darkDimTheme, lightHighContrastTheme } from '../theme';

import '../styles/globals.css';
import '@fontsource/spartan';
import '@fontsource/pt-serif';

// Reference: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js
const App = ({ Component, pageProps }: AppProps) => {
  let theme: Theme;
  // Use the preferred theme for this user and the browser
  const [preferredTheme, setPreferredTheme] = usePreferredTheme();
  switch (preferredTheme) {
    case LIGHT_DEFAULT:
      theme = lightTheme;
      break;
    case LIGHT_HIGH_CONTRAST:
      theme = lightHighContrastTheme;
      break;
    case DARK_DEFAULT:
      theme = darkTheme;
      break;
    case DARK_DIM:
      theme = darkDimTheme;
      break;
    default:
      setPreferredTheme(LIGHT_DEFAULT);
      theme = lightTheme;
      break;
  }

  // This hook is for ensuring the styling is in sync between client and server
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  const changeTheme = (themeId: ThemeName) => {
    switch (themeId) {
      case LIGHT_DEFAULT:
        theme = lightTheme;
        break;
      case LIGHT_HIGH_CONTRAST:
        theme = lightHighContrastTheme;
        break;
      case DARK_DEFAULT:
        theme = darkTheme;
        break;
      case DARK_DIM:
        theme = darkDimTheme;
        break;
      default:
        console.warn('no theme is selected');
        break;
    }
    setPreferredTheme(themeId);
  };

  return (
    <SWRConfig
      value={{ fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()) }}
    >
      <ThemeContext.Provider value={{ theme, preferredTheme, changeTheme }}>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </ThemeProvider>
      </ThemeContext.Provider>
    </SWRConfig>
  );
};

export default App;
