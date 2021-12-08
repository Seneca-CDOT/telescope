import { createContext, ReactNode, useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';

export interface SearchContextInterface {
  post: string;
  author: string;
  from: string;
  to: string;
  title: string;
  showHelp: boolean;
  toggleHelp: (value: boolean) => void;
  onPostChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onSubmitHandler: (value: FormEvent) => void;
  onTitleChange: (value: string) => void;
}

const SearchContext = createContext<SearchContextInterface>({
  post: '',
  author: '',
  from: '',
  to: '',
  title: '',
  showHelp: true,
  toggleHelp() {
    throw new Error('This context must be wrapped inside SearchProvider');
  },
  onPostChange() {
    throw new Error('This context must be wrapped inside SearchProvider');
  },
  onAuthorChange() {
    throw new Error('This context must be wrapped inside SearchProvider');
  },
  onStartDateChange() {
    throw new Error('This context must be wrapped inside SearchProvider');
  },
  onEndDateChange() {
    throw new Error('This context must be wrapped inside SearchProvider');
  },
  onTitleChange() {
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
  const [post, setPost] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');

  const [showHelp, setShowHelp] = useState(true);

  // const buildDateQuery = () => {
  //   let query = '/search/?';
  //   if (to) {
  //     query += `post`;
  //   }
  // };

  const onSubmitHandler = (event: FormEvent) => {
    event.preventDefault();
    // if (to || from) {
    //   const query = buildDateQuery();
    // }
    router.push(`/search?/post=${post}&author=${author}&title=${title}`);
  };

  const toggleHelp = (value: boolean) => {
    setShowHelp(value);
  };

  const onPostChange = (value: string) => {
    setPost(value);
  };

  const onTitleChange = (value: string) => {
    setTitle(value);
  };

  const onAuthorChange = (value: string) => {
    setAuthor(value);
  };

  const onStartDateChange = (value: string) => {
    setFrom(value);
  };

  const onEndDateChange = (value: string) => {
    console.log('end date', value);
    if (value) {
      setTo(value);
    } else {
      setTo(new Date().toISOString().split('T')[0]);
    }
  };

  useEffect(() => {
    setPost(textParam);
    setAuthor(textParam);
    setFrom(textParam);
    setTo(textParam);
    setTitle(textParam);
  }, [textParam, filterParam]);

  return (
    <SearchContext.Provider
      value={{
        post,
        author,
        from,
        to,
        title,
        showHelp,
        toggleHelp,
        onPostChange,
        onAuthorChange,
        onTitleChange,
        onStartDateChange,
        onEndDateChange,
        onSubmitHandler,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
export { SearchContext };
