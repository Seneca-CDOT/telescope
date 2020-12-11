import React, { useState } from 'react';
import { useQueryParam, StringParam } from 'use-query-params';
import { makeStyles } from '@material-ui/core/styles';

import SearchBar from '../SearchBar';
import SearchResults from './SearchResults.jsx';
import BackToTopButton from '../BackToTopButton';

const useStyles = makeStyles(() => ({
  anchor: {
    position: 'absolute',
    top: 0,
  },
  anchorMobile: {
    position: 'relative',
    bottom: '71px',
  },
}));

const SearchPage = () => {
  const classes = useStyles();
  // We synchronize the `text` and `filter` values to the URL's query string
  // via `textParam` and `filterParam`. The <SearchBar> UI uses our internal
  // state values, and the <SearchResults> only update on page load or when
  // the user submits the form.
  const [textParam = '', setTextParam] = useQueryParam('text', StringParam);
  const [filterParam = 'post', setFilterParam] = useQueryParam('filter', StringParam);

  // We manage the state of `text` and `filter` internally, and update URL on
  // form submit only.  These are used in the <SearchBar>, and the user can change them.
  const [text, setText] = useState(textParam);
  const [filter, setFilter] = useState(filterParam);

  // Form was submitted, so go ahead and sync to URL, (re)triggering search.
  function onSubmitHandler(event) {
    event.preventDefault();
    setTextParam(text);
    setFilterParam(filter);
  }

  return (
    <div>
      <div className={classes.anchor} id="back-to-top-anchor" />
      <div className={classes.anchorMobile} id="back-to-top-anchor-mobile" />
      <SearchBar
        text={text}
        onTextChange={(value) => setText(value)}
        filter={filter}
        onFilterChange={(value) => setFilter(value)}
        onSubmit={onSubmitHandler}
      />
      <br />
      <SearchResults text={textParam} filter={filterParam} />
      <BackToTopButton />
    </div>
  );
};

export default SearchPage;
