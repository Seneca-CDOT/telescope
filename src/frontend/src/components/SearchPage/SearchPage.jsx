import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Header from '../Header';
import SearchBar from '../SearchBar';

const SearchPage = () => {
  const SEARCH_QUERY = gql`
    query testQuery {
      getPosts(page: 0, perPage: 5) {
        title
      }
    }
  `;

  const [searchText, setSearchText] = useState('This is a test query');
  const [results, setResults] = useState([]);

  let queryResults;

  const [executeSearch, { data }] = useLazyQuery(SEARCH_QUERY, {
    onCompleted: () => {},
  });
  if (data) {
    queryResults = data.getPosts;
  }

  useEffect(() => {
    setResults(queryResults);
    console.log(results);
  }, queryResults);

  function onClickHandler() {
    executeSearch();
  }

  function onChangeHandler(event) {
    setSearchText(event.target.value);
  }

  return (
    <div>
      <Header />
      <div
        style={{
          height: '12vh',
        }}
      ></div>
      <SearchBar
        onClickHandler={onClickHandler}
        searchText={searchText}
        onChangeHandler={onChangeHandler}
      />
    </div>
  );
};

export default SearchPage;
