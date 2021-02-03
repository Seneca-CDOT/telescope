import { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@material-ui/core/styles';
import UserProvider from '../components/UserProvider';

import '../styles/globals.css';
import { darkTheme, lightTheme } from '../theme';

// Reference: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_app.js
const App = ({ Component, pageProps }: AppProps) => {
  // This hook is for ensuring the styling is sync between client and server
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    if (theme.palette.type === 'light') {
      setTheme(darkTheme);
    } else {
      setTheme(lightTheme);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <UserProvider>
        <Component {...pageProps} theme={theme} toggleTheme={toggleTheme} />
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
