import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Header from '../Header';
import SearchBar from '../SearchBar';
import AuthorResult from '../AuthorResult';

const SearchPage = () => {
  const SEARCH_QUERY = gql`
    query testQuery($author: String!) {
      getPosts(page: 0, perPage: 5, filter: { author: $author }) {
        title
        published
        feed {
          id
          author
        }
      }
    }
  `;

  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);

  const [executeSearch, { data }] = useLazyQuery(SEARCH_QUERY, {
    // setting author variable here to use in the query above
    variables: { author: searchText },
    onCompleted: () => {
      const returnedIds = [];
      const finalResults = data.getPosts
        .map(result => {
          if (!returnedIds.includes(result.feed.id)) {
            returnedIds.push(result.feed.id);
            return {
              id: result.feed.id,
              author: result.feed.author,
              title: result.title,
              lastPostDate: result.published,
            };
          }
        })
        // filters undefined items that might have been pushed when we're checking for duplicate author results
        .filter(item => item);
      setResults(finalResults);
    },
  });

  useEffect(() => {}, [results]);

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
      {results.length > 0 ? (
        results.map(result => {
          console.log(results);
          return (
            <AuthorResult
              key={result.id}
              posts={result.title}
              author={result.author}
              lastPostDate={result.lastPostDate}
            />
          );
        })
      ) : (
        <h1>No Results</h1>
      )}
    </div>
  );
};

export default SearchPage;
