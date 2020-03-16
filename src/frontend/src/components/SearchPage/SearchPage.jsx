import React, { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import Header from '../Header';
import SearchBar from '../SearchBar';
import AuthorResult from '../AuthorResult';

const useStyles = makeStyles(() => ({
  searchReply: {
    margin: 'auto',
    padding: '2rem',
    color: 'coral',
    fontWeight: 400,
  },
  divAfterHeader: {
    height: '12vh',
    minHeight: '12em',
  },
}));

const SearchPage = () => {
  const classes = useStyles();
  const SEARCH_QUERY = gql`
    query SearchAuthorQuery($author: String!) {
      getPosts(page: 0, perPage: 25, filter: { author: $author }) {
        title
        published
        url
        feed {
          id
          author
        }
      }
    }
  `;

  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState([]);
  const [searchTextIsEmpty, setSearchTextIsEmpty] = useState(true);

  const [executeSearch, { data }] = useLazyQuery(SEARCH_QUERY, {
    // setting author variable here to use in the query above
    variables: { author: searchText },

    onCompleted: () => {
      const returnedIds = [];
      // We only want to display an author once, this would avoid the issue if
      // there are multiple posts by the same author returned in our query
      const finalResults = data.getPosts
        .map(result => {
          if (!returnedIds.includes(result.feed.id)) {
            returnedIds.push(result.feed.id);
            return {
              id: result.feed.id,
              author: result.feed.author,
              // The post will contain information about their most recent post to be used for AuthorResult component
              post: {
                title: result.title,
                postLink: result.url,
                postDate: result.published,
              },
            };
          }
        })
        // Filters undefined items that might have been pushed/mapped when we're checking for duplicate author results
        .filter(item => item);
      setResults(finalResults);
    },
  });

  // Hook that will re-render the page only if the state of results changes
  useEffect(() => {}, []);

  function onChangeHandler(event) {
    setSearchText(event.target.value);
    if (searchText.length > 0) {
      setSearchTextIsEmpty(false);
    } else {
      setSearchTextIsEmpty(true);
    }
  }

  const displayResults = () => {
    // The initial state of results is going to be 0 and we can't map 0,
    //  this will check if there are any results and return AuthorResult component
    //  for each with feed guid as key, otherwise default to "No Results"
    if (results.length > 0)
      return results.map(result => (
        <AuthorResult key={result.id} author={result.author} post={result.post} />
      ));
    if (searchText.length > 0 && results.length < 1)
      return <h1 className={classes.searchReply}>No results found</h1>;
  };

  function onClickHandler() {
    executeSearch();
  }

  return (
    <div>
      <Header />
      <div className={classes.divAfterHeader}></div>
      <SearchBar
        onClickHandler={onClickHandler}
        searchText={searchText}
        onChangeHandler={onChangeHandler}
      />
      {!searchTextIsEmpty ? (
        displayResults()
      ) : (
        <h1 className={classes.searchReply}>No search terms entered</h1>
      )}
    </div>
  );
};

export default SearchPage;
