import SEO from '../components/SEO';
import SearchPage from '../components/SearchPage';
import SearchProvider from '../components/SearchProvider';
import NavBar from '../components/NavBar';

const Search = () => {
  return (
    <SearchProvider>
      <SEO pageTitle="Search | Telescope" />
      <NavBar />
      <SearchPage />
    </SearchProvider>
  );
};

export default Search;
