import React from 'react';
import PropTypes from 'prop-types';
import { useSWRInfinite } from 'swr';

import { Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Post from '../Post/Post.jsx';
import Spinner from '../Spinner/Spinner.jsx';
import LoadMoreButton from './LoadMoreButton.jsx';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    maxWidth: '785px',
  },
  activeCircle: {
    borderRadius: '4rem',
    transition: 'all linear 250ms',
    color: theme.palette.primary,
  },
}));

const Posts = ({ telescopeUrl, searchResults }) => {
  const classes = useStyles();
  const { data, size, setSize, error } = useSWRInfinite(
    (index) => (searchResults ? null : `${telescopeUrl}/posts?page=${index + 1}`),
    (url) => fetch(url).then((r) => r.json()),
    {
      refreshInterval: 5 * 60 * 1000 /* refresh data every 5 minutes */,
    }
  );

  // Use the data we got from the server, or the provided search results
  const pages = data || (searchResults ? searchResults.values : null);

  const initialLoad = !pages && !error;

  if (error) {
    console.error('Error loading posts', error);
    return null;
  }

  if (initialLoad || !(pages && pages.length)) {
    return (
      <>
        <Grid container spacing={0} direction="column" alignItems="center" justify="center">
          <Spinner className={classes.activeCircle} />
        </Grid>
      </>
    );
  }

  // Iterate over all the pages (an array of arrays) and then convert all post
  // elements to <Post>
  const timeline = pages.map((page) =>
    page.map(({ id, url }) => <Post postUrl={`${telescopeUrl}${url}`} key={id} />)
  );

  // Add a "Load More" button at the end of the timeline.  Give it a unique
  // key each time, based on page (i.e., size), so we remove the previous one
  if (!searchResults) {
    timeline.push(
      <LoadMoreButton onClick={() => setSize(size + 1)} key={`load-more-button-${size}`} />
    );
  }

  return (
    <Container className={classes.root}>
      <Container className={classes.root}>{timeline}</Container>
    </Container>
  );
};

Posts.propTypes = {
  className: PropTypes.string,
  searchResults: PropTypes.array,
  telescopeUrl: PropTypes.string,
};

export default Posts;
