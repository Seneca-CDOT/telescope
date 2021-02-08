import Head from 'next/head';
import SEO from '../components/SEO';
import SearchPage from '../components/SearchPage';

const Search = () => {
  return (
    <>
      <Head>
        <title>Search</title>
        <meta property="og:title" content="Telescope" key="title" />
      </Head>
      <SEO pageTitle="Search" />
      <SearchPage />
    </>
  );
};

export default Search;
