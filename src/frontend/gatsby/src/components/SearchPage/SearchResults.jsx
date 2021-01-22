import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSWRInfinite } from 'swr';
import { Container, Box } from '@material-ui/core';

import useSiteMetadata from '../../hooks/use-site-metadata';
import Timeline from '../Posts/Timeline';
import Spinner from '../Spinner';

const useStyles = makeStyles(() => ({
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
    position: 'absolute',
    display: 'flex',
    top: '40%',
    left: '29.5%',
    right: '29.5%',
    bottom: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    background: '#353F61',
    boxShadow: '0 15px 30px rgba(0,0,0,.5)',
    lineHeight: '1em',
  },
  errorMessage: {
    fontSize: '60px',
    color: '#fff',
  },
  messageBox: {
    fontSize: '20px',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#96C1E7',
  },
}));

const SearchResults = ({ text, filter }) => {
  const classes = useStyles();
  const { telescopeUrl } = useSiteMetadata();
  const prepareUrl = (index) =>
    `${telescopeUrl}/query?text=${encodeURIComponent(text)}&filter=${filter}&page=${index}`;

  // We only bother doing the request if we have something to search for.
  const shouldFetch = () => text.length > 0;
  const { data, size, setSize, loading, error } = useSWRInfinite(
    (index) => (shouldFetch() ? prepareUrl(index) : null),
    async (u) => {
      const res = await fetch(u);
      const results = await res.json();
      return results.values;
    }
  );

  if (error) {
    return (
      <Container className={classes.searchResults}>
        <Box className={classes.root} boxShadow={2} marginTop={10}>
          <div className={classes.errorBackground}>
            <div>
              <p className={classes.errorMessage}>Search Error</p>
              <p className={classes.messageBox}>
                There was an server error while processing your query
              </p>
            </div>
          </div>
        </Box>
      </Container>
    );
  }

  if (text.length && loading) {
    return (
      <Container className={classes.searchResults}>
        <h1 className={classes.spinner}>
          <Spinner />
        </h1>
      </Container>
    );
  }

  return (
    <Container className={classes.searchResults}>
      {data && data.length ? (
        <Timeline pages={data} nextPage={() => setSize(size + 1)} />
      ) : (
        <h1>No search results</h1>
      )}
    </Container>
  );
};

SearchResults.propTypes = {
  text: PropTypes.string,
  filter: PropTypes.string,
};

export default SearchResults;
