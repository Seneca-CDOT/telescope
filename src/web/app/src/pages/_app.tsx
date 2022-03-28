import { useEffect } from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@material-ui/core/styles';
import { SWRConfig } from 'swr';

import AuthProvider from '../components/AuthProvider';

import { darkTheme, lightTheme } from '../theme';
import usePreferredTheme from '../hooks/use-preferred-theme';
import { ThemeContext } from '../components/ThemeProvider';

import '../styles/globals.css';
import '@fontsource/spartan';
import '@fontsource/pt-serif';

// Reference: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js
const App = ({ Component, pageProps }: AppProps) => {
  // Use the preferred theme for this user and the browser (one of 'dark' or 'light').
  const [preferredTheme, setPreferredTheme] = usePreferredTheme();
  // Set our initial theme to be the preferred system theme, or light theme be default,
  const theme = preferredTheme === 'dark' ? darkTheme : lightTheme;

  // This hook is for ensuring the styling is in sync between client and server
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  // Switch the active theme, and also store it for next load
  const toggleTheme = () => {
    setPreferredTheme(preferredTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <SWRConfig
      value={{ fetcher: (resource, init) => fetch(resource, init).then((res) => res.json()) }}
    >
      <ThemeContext.Provider value={{ theme, themeName: theme.palette.type, toggleTheme }}>
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
