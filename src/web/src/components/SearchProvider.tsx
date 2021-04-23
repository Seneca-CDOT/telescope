import { createContext, ReactNode, useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';

type FilterProp = {
  filter: 'post' | 'author' | string;
};

export interface SearchContextInterface {
  text: string;
  textParam: string;
  filter: FilterProp['filter'];
  showHelp: boolean;

  advancedSearchInAuthor: boolean;

  toggleHelp: (value: boolean) => void;
  toggleAdvancedSearchInAuthor: (value: boolean) => void;
  onTextChange: (value: string) => void;
  onFilterChange: (value: FilterProp['filter']) => void;
  onSubmitHandler: (value: FormEvent) => void;
}

const SearchContext = createContext<SearchContextInterface>({
  text: '',
  textParam: '',
  filter: 'post',
  showHelp: true,
  advancedSearchInAuthor: false,
  toggleHelp() {
    throw new Error('This context must be wrapped inside SearchProvider');
  },
  toggleAdvancedSearchInAuthor() {
    throw new Error('This context must be wrapped inside SearchProvider');
  },
  onTextChange() {
    throw new Error('This context must be wrapped inside SearchProvider');
  },
  onFilterChange() {
    throw new Error('This context must be wrapped inside SearchProvider');
  },
  onSubmitHandler() {
    throw new Error('This context must be wrapped inside SearchProvider');
  },
});

type Props = {
  children: ReactNode;
};

const SearchProvider = ({ children }: Props) => {
  const router = useRouter();
  // We synchronize the `text` and `filter` values to the URL's query string
  // Router query object for a query can be an array if url becomes text=123&text=456
  // https://stackoverflow.com/questions/60110364/type-string-string-is-not-assignable-to-type-string
  const textParam = Array.isArray(router.query.text)
    ? router.query.text[0]
    : router.query.text || '';
  const filterParam = router.query.filter === 'post' || !router.query.filter ? 'post' : 'author';

  // We manage the state of `text` and `filter` internally, and update URL on
  // form submit only.  These are used in the <SearchBar>, and the user can change them.
  const [text, setText] = useState('');
  const [filter, setFilter] = useState<FilterProp['filter']>('post');
  const [showHelp, setShowHelp] = useState(true);
  const [advancedSearchInAuthor, setAdvancedSearchInAuthor] = useState(false);

  const onSubmitHandler = (event: FormEvent) => {
    event.preventDefault();
    router.push(`/search?text=${text}&filter=${filter}`);
  };

  const toggleHelp = (value: boolean) => {
    setShowHelp(value);
  };

  const toggleAdvancedSearchInAuthor = (value: boolean) => {
    setAdvancedSearchInAuthor(value);
  };

  const onTextChange = (value: string) => {
    setText(value);
  };

  const onFilterChange = (value: FilterProp['filter']) => {
    setFilter(value);
  };

  useEffect(() => {
    setText(textParam);
    setFilter(filterParam);
  }, [textParam, filterParam]);

  return (
    <SearchContext.Provider
      value={{
        text,
        textParam,
        showHelp,
        filter,
        advancedSearchInAuthor,
        onTextChange,
        onFilterChange,
        onSubmitHandler,
        toggleHelp,
        toggleAdvancedSearchInAuthor,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
export { SearchContext };
