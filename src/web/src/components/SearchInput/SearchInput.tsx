import PostSearchInput from './PostSearchInput';
import AuthorSearchInput from './AuthorSearchInput';
import DateSearchInput from './DateSearchInput';
import useSearchValue from '../../hooks/use-search-value';

const SearchInput = () => {
  const { filter } = useSearchValue();

  function getComponent(f: string) {
    switch (f) {
      case 'author':
        return <AuthorSearchInput />;
      case 'date':
        return <DateSearchInput />;
      default:
        return <PostSearchInput />;
    }
  }

  return getComponent(filter);
};

export default SearchInput;
