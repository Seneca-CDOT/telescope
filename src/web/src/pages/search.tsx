import SEO from '../components/SEO';
import SearchPage from '../components/SearchPage';
import SearchProvider from '../components/SearchProvider';

const Search = () => {
  return (
    <>
      <SearchProvider>
        <SEO pageTitle="Search | Telescope" />
        <SearchPage />
      </SearchProvider>
    </>
  );
};

export default Search;
