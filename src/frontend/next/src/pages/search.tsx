import { Theme } from '@material-ui/core';
import Head from 'next/head';
import SEO from '../components/SEO';
import SearchPage from '../components/SearchPage';
import ThemeToggleButton from '../components/ThemeToggleButton';

type Props = {
  theme: Theme;
  toggleTheme: () => void;
};

const Search = ({ theme, toggleTheme }: Props) => {
  return (
    <>
      <Head>
        <title>Search</title>
        <meta property="og:title" content="Telescope" key="title" />
      </Head>
      <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
      <SEO pageTitle="Search" />
      <SearchPage />
    </>
  );
};

export default Search;
