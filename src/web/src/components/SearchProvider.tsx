import { createContext, ReactNode, useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';

type FilterProp = {
  filter: 'post' | 'author' | 'date' | string;
};

export interface SearchContextInterface {
  text: string;
  textParam: string;
  filter: FilterProp['filter'];
  showHelp: boolean;
  toggleHelp: (value: boolean) => void;
  onTextChange: (value: string) => void;
  onFilterChange: (value: FilterProp['filter']) => void;
  onSubmitHandler: (value: FormEvent) => void;
}

const SearchContext = createContext<SearchContextInterface>({
  text: '',
  textParam: '',
  filter: 'post',
  showHelp: true,
  toggleHelp() {
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

// Returns the string in the filter accordingly after loading results.
function getFilter(filter: any) {
  switch (filter) {
    case 'author':
      return 'author';
    case 'date':
      return 'date';
    case 'post':
    default:
      return 'post';
  }
}

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
  const filterParam = getFilter(router.query.filter);

  // We manage the state of `text` and `filter` internally, and update URL on
  // form submit only.  These are used in the <SearchBar>, and the user can change them.
  const [text, setText] = useState('');
  const [filter, setFilter] = useState<FilterProp['filter']>('post');
  const [showHelp, setShowHelp] = useState(true);

  const onSubmitHandler = (event: FormEvent) => {
    event.preventDefault();
    router.push(`/search?text=${text}&filter=${filter}`);
  };

  const toggleHelp = (value: boolean) => {
    setShowHelp(value);
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
        onTextChange,
        onFilterChange,
        onSubmitHandler,
        toggleHelp,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
export { SearchContext };
