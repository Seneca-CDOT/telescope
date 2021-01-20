import { FormEvent, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';

import SearchResults from '../components/SearchResults';
import SearchBar from '../components/SearchBar';
import BackToTopButton from '../components/BackToTopButton';

type FilterProp = {
  filter: 'post' | 'author';
};

const useStyles = makeStyles(() => ({
  anchor: {
    position: 'absolute',
    top: 0,
  },
}));

const SearchPage = () => {
  const classes = useStyles();
  const router = useRouter();
  // We synchronize the `text` and `filter` values to the URL's query string
  // Router query object for a query can be an array if url becomes text=123&text=456
  // https://stackoverflow.com/questions/60110364/type-string-string-is-not-assignable-to-type-string
  const [textParam = '', setTextParam] = useState(
    Array.isArray(router.query.text) ? router.query.text[0] : router.query.text
  );
  const [filterParam = 'post', setFilterParam] = useState<FilterProp['filter']>(
    router.query.filter === 'post' ? 'post' : 'author'
  );

  // We manage the state of `text` and `filter` internally, and update URL on
  // form submit only.  These are used in the <SearchBar>, and the user can change them.
  const [text, setText] = useState('');
  const [filter, setFilter] = useState<FilterProp['filter']>('post');

  // Form was submitted, so go ahead and sync to URL, (re)triggering search.
  function onSubmitHandler(event: FormEvent) {
    event.preventDefault();
    setTextParam(text);
    setFilterParam(filter);
    router.push(`/search?text=${text}&filter=${filter}`);
  }

  return (
    <div>
      <div className={classes.anchor} id="back-to-top-anchor" />
      <SearchBar
        text={text}
        onTextChange={(value: string) => setText(value)}
        filter={filter}
        onFilterChange={(value: FilterProp['filter']) => setFilter(value)}
        onSubmit={onSubmitHandler}
      />
      <br />
      <SearchResults text={textParam} filter={filterParam} />
      <BackToTopButton />
    </div>
  );
};

export default SearchPage;
