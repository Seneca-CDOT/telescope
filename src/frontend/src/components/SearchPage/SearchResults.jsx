import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { useSWRInfinite } from 'swr';
import { Container, Box, Grid, Typography, ListSubheader } from '@material-ui/core';

import useSiteMetadata from '../../hooks/use-site-metadata';
import Timeline from '../Posts/Timeline.jsx';
import Spinner from '../Spinner';

const useStyles = makeStyles((theme) => ({
  spinner: {
    display: 'flex',
    justifyContent: 'center',
  },
  searchResults: {
    padding: 0,
    width: '100%',
    justifyContent: 'center',
    color: theme.palette.text.default,
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
          <ListSubheader>
            <Typography variant="h1" color="secondary" className={classes.title}>
              <Grid container className={classes.error}>
                {' '}
                There was an error while processing your query
              </Grid>
            </Typography>
          </ListSubheader>
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
