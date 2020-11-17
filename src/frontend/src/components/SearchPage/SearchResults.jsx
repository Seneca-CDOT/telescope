import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSWRInfinite } from 'swr';
import { Container } from '@material-ui/core';

import useSiteMetadata from '../../hooks/use-site-metadata';
import Timeline from '../Posts/Timeline.jsx';
import Spinner from '../Spinner';

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
    // TODO: https://github.com/Seneca-CDOT/telescope/issues/1279
    return (
      <Container className={classes.searchResults}>
        <p>Error loading search results</p>;
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
        <h1>No results search</h1>
      )}
    </Container>
  );
};

SearchResults.propTypes = {
  text: PropTypes.string,
  filter: PropTypes.string,
};

export default SearchResults;
