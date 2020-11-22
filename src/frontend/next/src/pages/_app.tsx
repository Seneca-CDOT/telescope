import { AppProps } from 'next/app';
import '../styles/globals.css';

const App = ({ Component, pageProps }: AppProps) => {
  /* eslint-disable react/jsx-props-no-spreading */
  return <Component {...pageProps} />;
};

export default App;
