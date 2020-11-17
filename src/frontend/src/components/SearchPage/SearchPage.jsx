import React, { useState } from 'react';
import { useQueryParam, StringParam } from 'use-query-params';

import SearchBar from '../SearchBar';
import SearchResults from './SearchResults.jsx';

function SearchPage() {
  const { telescopeUrl } = useSiteMetadata();
  const classes = useStyles();

  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState(undefined);
  const [filter, setFilter] = useState('post');
  const [fetchLoading, setFetchLoading] = useState(false);

  const search = async () => {
    const encodedSearchText = encodeURIComponent(searchText);
    try {
      setFetchLoading(true);
      const res = await fetch(`${telescopeUrl}/query?text=${encodedSearchText}&filter=${filter}`);
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      const posts = await res.json();
      setResults(posts.values);
      console.log(results);
    } catch (error) {
      console.error('Something went wrong while fetching data', error);
    } finally {
      setFetchLoading(false);
    }
  };

  // Displays one of three options depending on whether there is a search string, results and no results
  const displayResults = () => {
    if (searchText.length > 0 && fetchLoading) {
      return (
        <h1 className={classes.spinner}>
          <Spinner />
        </h1>
      );
    }

    if (!results) {
      return null;
    }
    return <Timeline pages={[results]} />;
  };

  function onChangeHandler(value) {
    setSearchText(value);
  }

  function onFilterChangeHandler(value) {
    setFilter(value);
  }

  function onFormSubmitHandler() {
    search();
  }
  
const SearchPage = () => {
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
      <SearchBar
        text={text}
        onTextChange={(value) => setText(value)}
        filter={filter}
        onFilterChange={(value) => setFilter(value)}
        onSubmit={onSubmitHandler}
      />
      <br />
      <SearchResults text={textParam} filter={filterParam} />
    </div>
  );
}

export default SearchPage;
