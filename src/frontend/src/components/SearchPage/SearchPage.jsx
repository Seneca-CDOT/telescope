import React, { useState, useEffect } from 'react';

import { Container } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useQueryParam, StringParam } from 'use-query-params';
import { makeStyles } from '@material-ui/core/styles';

import useSiteMetadata from '../../hooks/use-site-metadata';

import Timeline from '../Posts/Timeline.jsx';
import SearchBar from '../SearchBar';
import Spinner from '../Spinner';
//import { useEffect } from 'react';

const useStyles = makeStyles(() => ({
  spinner: {
    display: 'flex',
    justifyContent: 'center',
  },
  searchResults: {
    padding: 0,
    width: '785px',
    justifyContent: 'center',
  },
}));

const SearchPage = () => {
  const { telescopeUrl } = useSiteMetadata();
  const classes = useStyles();
  const [searchText = '', setSearchText] = useQueryParam('text', StringParam);
  const [filter = 'post', setFilter] = useQueryParam('filter', StringParam);
  const [results, setResults] = useState(undefined);
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
    } catch (error) {
      console.error('Something went wrong while fetching data', error);
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    search();
  }, [telescopeUrl]);

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

  return (
    <div>
      <SearchBar
        searchText={searchText}
        onChangeHandler={onChangeHandler}
        filter={filter}
        onFormSubmit={onFormSubmitHandler}
        onFilterChangeHandler={onFilterChangeHandler}
      />
      <br />
      <Container className={classes.searchResults}>{displayResults()}</Container>
    </div>
  );
};

export default SearchPage;
