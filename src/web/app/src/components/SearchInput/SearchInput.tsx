import PostSearchInput from './PostSearchInput';
import AuthorSearchInput from './AuthorSearchInput';
import useSearchValue from '../../hooks/use-search-value';

const SearchInput = () => {
  const { filter } = useSearchValue();

  return <>{filter === 'author' ? <AuthorSearchInput /> : <PostSearchInput />}</>;
};

export default SearchInput;
