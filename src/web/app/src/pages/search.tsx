import SEO from '@components/SEO';
import SearchPage from '@components/SearchPage';
import NavBar from '@components/NavBar';

const Search = () => {
  return (
    <>
      <SEO pageTitle="Search | Telescope" />
      <NavBar />
      <SearchPage />
    </>
  );
};

export default Search;
