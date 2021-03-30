import PostSearchInput from './PostSearchInput';
import AuthorSearchInput from './AuthorSearchInput';
import useSearchValue from '../../hooks/use-search-value';

const SearchInput = () => {
  const { text, filter, onTextChange } = useSearchValue();

  return filter === 'author' ? (
    <AuthorSearchInput text={text} onChange={(event) => onTextChange(event.target.value)} />
  ) : (
    <PostSearchInput text={text} onChange={(event) => onTextChange(event.target.value)} />
  );
};

export default SearchInput;
