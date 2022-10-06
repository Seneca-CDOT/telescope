import { useState } from 'react';
import { useRouter } from 'next/router';
import { makeStyles, Theme } from '@material-ui/core/styles';
import useSWRInfinite from 'swr/infinite';
import { Container, Box, createStyles } from '@material-ui/core';
import { searchServiceUrl } from '@config';
import Timeline from './Posts/Timeline';
import Spinner from './Spinner';
import SearchHelp from './SearchHelp';

const NoResultsImg = '/noResults.svg';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    spinner: {
      display: 'flex',
      justifyContent: 'center',
    },
    searchResults: {
      padding: 0,
      width: '100%',
      justifyContent: 'center',
    },
    errorBackground: {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '10px',
      background: '#353F61',
      boxShadow: '0 15px 30px rgba(0,0,0,.5)',
      lineHeight: '1rem',
    },
    errorTitle: {
      textAlign: 'center',
      fontSize: '5rem',
      color: '#fff',
    },
    errorMessage: {
      lineHeight: '2rem',
      fontSize: '2rem',
      textAlign: 'center',
      margin: '2rem',
      color: '#96C1E7',
    },
    noResults: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      margin: '2rem',
      color: theme.palette.primary.main,
    },
    errorBox: {
      maxWidth: '500px',
      borderRadius: '20px',
      margin: 'auto',
    },
  })
);

const SearchResults = () => {
  const router = useRouter();
  const classes = useStyles();
  const [totalPosts, setTotalPosts] = useState(0);
  const postParam = Array.isArray(router.query.post)
    ? router.query.post[0]
    : router.query.post || '';

  const authorParam = Array.isArray(router.query.author)
    ? router.query.author[0]
    : router.query.author || '';

  const titleParam = Array.isArray(router.query.title)
    ? router.query.title[0]
    : router.query.title || '';

  const prepareUrl = (index: number) =>
    `${searchServiceUrl}/?author=${encodeURIComponent(authorParam)}&post=${encodeURIComponent(
      postParam
    )}&title=${encodeURIComponent(titleParam)}&page=${index}`;

  // We only bother doing the request if we have something to search for.
  const shouldFetch = () => postParam.length > 0 || authorParam.length > 0 || titleParam.length > 0;
  const { data, size, setSize, error } = useSWRInfinite(
    (index: number) => (shouldFetch() ? prepareUrl(index) : null),
    async (u: string) => {
      const res = await fetch(u);
      const results = await res.json();

      setTotalPosts(results.results);
      return results.values;
    }
  );
  const loading = !data && !error;
  // Search result is empty when the the array of posts on the first page is empty
  const isEmpty = !data?.[0]?.length;
  // There no more posts when the last page has no posts
  const isReachingEnd = !data?.[data.length - 1]?.length;
  // Another page is being loaded when size is incremented but data[size - 1] is still undefined
  const loadingMoreData =
    !isReachingEnd && data && size > 0 && typeof data[size - 1] === 'undefined';

  // If there is no posts or if the search bar is empty, then show the search help, otherwise hide it
  if (
    !error &&
    isEmpty &&
    postParam.length === 0 &&
    authorParam.length === 0 &&
    titleParam.length === 0
  ) {
    return <SearchHelp />;
  }
  if (error) {
    return (
      <Container className={classes.searchResults}>
        <Box boxShadow={2} marginTop={10} className={classes.errorBox}>
          <div className={classes.errorBackground}>
            <div>
              <p className={classes.errorTitle}>Search Error</p>
              <p className={classes.errorMessage}>
                There was a server error while processing your query
              </p>
            </div>
          </div>
        </Box>
      </Container>
    );
  }

  if ((postParam.length || authorParam.length || titleParam.length) && loading) {
    return (
      <Container className={classes.searchResults}>
        <h1 className={classes.spinner}>
          <Spinner />
        </h1>
      </Container>
    );
  }

  if (data === undefined) {
    return null;
  }

  return (
    <Container className={classes.searchResults}>
      {!isEmpty ? (
        <>
          <Timeline pages={data} totalPosts={totalPosts} nextPage={() => setSize(size + 1)} />
          {loadingMoreData && (
            <h1 className={classes.spinner}>
              <Spinner />
            </h1>
          )}
        </>
      ) : (
        <div className={classes.noResults}>
          <img src={NoResultsImg} alt="No Results Found" height={200} width={200} />
          <h1>No Results Found</h1>
        </div>
      )}
    </Container>
  );
};

export default SearchResults;
