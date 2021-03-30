import PostSearchInput from './PostSearchInput';
import AuthorSearchInput from './AuthorSearchInput';

type searchInputProps = {
  text: string;
  onTextChange: Function;
  searchFilter: string;
};

const SearchInput = ({ text, onTextChange, searchFilter }: searchInputProps) => {
  return searchFilter === 'author' ? (
    <AuthorSearchInput text={text} onChange={(event) => onTextChange(event.target.value)} />
  ) : (
    <PostSearchInput text={text} onChange={(event) => onTextChange(event.target.value)} />
  );
};

export default SearchInput;
