import { useLazyQuery } from '@apollo/react-hooks';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import useSiteMetadata from '../../hooks/use-site-metadata';
import AuthorResult from '../AuthorResult';
import Posts from '../Posts';
import SearchBar from '../SearchBar';
import Spinner from '../Spinner';

const useStyles = makeStyles(() => ({
  boxAfterHeader: {
    minHeight: '12em',
    display: 'flex',
  },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
  },
}));

const SearchPage = () => {
  const { telescopeUrl } = useSiteMetadata();
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
  const [results, setResults] = useState(undefined);
  const [filter, setFilter] = useState('');
  const [fetchLoading, setFetchLoading] = useState(false);
  const [searchEnabled, setSearchEnabled] = useState(false);
  const [searchAuthors, { loading, data }] = useLazyQuery(SEARCH_QUERY, {
    // Setting author variable here to use in the query above
    variables: { author: searchText },
    onCompleted: () => {
      // We only want to display a feed once when searching posts for
      // author, this would avoid the issue if there are duplicate
      // feed results returned in our query
      const finalResults = data.getPosts
        .filter(
          (element, index, self) =>
            self.findIndex((result) => result.feed.id === element.feed.id) === index
        )
        .map((result) => {
          return {
            id: result.feed.id,
            author: result.feed.author,
            // The post will contain information about their most recent post to be used for AuthorResult component
            post: {
              title: result.title,
              postLink: result.url,
              postDate: new Intl.DateTimeFormat('en-US').format(result.published),
            },
          };
        });
      setResults({ type: 'author', searchResults: finalResults });
    },
  });

  useEffect(() => {
    async function searchPosts() {
      // Setting to check length > 3, as the component will trying to fetch with 0 length causing error
      if (searchText.length > 3) {
        const encodedSearchText = encodeURIComponent(searchText);
        try {
          setFetchLoading(true);
          let res = await fetch(`${telescopeUrl}/query?search=${encodedSearchText}`);
          if (!res.ok) {
            throw new Error(res.statusText);
          }
          let contentType = res.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Response was not json');
          }
          const searchResults = await res.json();
          // ES values property contains an array of objects with a (feed) id property
          const postIds = searchResults.values.map((result) => result.id);
          const posts = await Promise.all(
            postIds.map(async (id) => {
              res = await fetch(`${telescopeUrl}/posts/${id}`);
              if (!res.ok) {
                throw new Error(res.statusText);
              }
              contentType = res.headers.get('content-type');
              if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Response was not json');
              }
              return res.json();
            })
          );
          setFetchLoading(false);
          setResults({ type: 'post', searchResults: posts });
        } catch (error) {
          console.error('Something went wrong while fetching data', error);
        }
      } else {
        setResults({ type: 'post', searchResults: [] });
      }
    }

    if (filter === 'author') {
      searchAuthors();
    } else if (filter === 'post') {
      searchPosts();
    }

    setTimeout(() => setSearchEnabled(false), 500);
  }, [telescopeUrl, searchEnabled, searchText]);

  // Displays one of three options depending on whether there is a search string, results and no results
  const displayResults = () => {
    if (searchText.length > 0 && (loading || fetchLoading)) {
      return (
        <h1 className={classes.spinner}>
          <Spinner />
        </h1>
      );
    }

    if (!results) {
      return null;
    }

    if (results) {
      //  If result type is author return AuthorResult component
      //  for each with feed guid as key
      if (results.type === 'author') {
        return results.searchResults.map((result) => (
          <AuthorResult key={result.id} author={result.author} post={result.post} />
        ));
      }
      // If result type is post return Posts component for each result
      if (results.type === 'post') {
        return <Posts searchPostResults={results.searchResults} />;
      }
    }

    return null;
  };

  function onChangeHandler(value) {
    setSearchText(value);
  }

  function onFilterChangeHandler(value) {
    setFilter(value);
  }

  function onFormSubmitHandler() {
    setSearchEnabled(true);
  }

  return (
    <div>
      <Box className={classes.boxAfterHeader}></Box>
      <SearchBar
        searchText={searchText}
        onChangeHandler={onChangeHandler}
        filter={filter}
        onFormSubmit={onFormSubmitHandler}
        onFilterChangeHandler={onFilterChangeHandler}
      />
      <br />
      {displayResults()}
    </div>
  );
};

export default SearchPage;
