import React from 'react';
import { useSWRInfinite } from 'swr';
import { Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SentimentDissatisfiedRoundedIcon from '@material-ui/icons/SentimentDissatisfiedRounded';
import Timeline from './Timeline.jsx';
import useSiteMetaData from '../../hooks/use-site-metadata';
import useFaviconBadge from '../../hooks/use-favicon-badge';
import usePageLifecycle from '../../hooks/use-page-lifecycle';

const useStyles = makeStyles(() => ({
  root: {
    padding: 0,
    maxWidth: '785px',
  },
  error: {
    position: 'center',
    color: '#B5B5B5',
    fontFamily: 'Roboto',
    fontSize: '5rem',
    paddingBottom: '30px',
  },
  errorIcon: {
    position: 'center',
    color: '#B5B5B5',
    fontSize: '10rem',
    paddingBottom: 0,
  },
}));

const usePrevious = (value) => {
  const ref = React.useRef(null);
  React.useEffect(() => {
    // If data is loaded, store the id of the first post to ref
    if (value !== undefined) {
      ref.current = value[0][0].id;
    }
  });
  return ref.current;
};

const REFRESH_INTERVAL = 5 * 60 * 1000; /* refresh data every 5 minutes */

const Posts = () => {
  const classes = useStyles();
  // Call setBadge(true) to show the favicon badge when the page is not visible
  const setBadge = useFaviconBadge(false); // pass true here to badge from the start
  const isVisible = usePageLifecycle();
  const { telescopeUrl } = useSiteMetaData();
  const { data, size, setSize, error } = useSWRInfinite(
    (index) => `${telescopeUrl}/posts?page=${index + 1}`,
    (url) => fetch(url).then((r) => r.json()),
    {
      refreshInterval: REFRESH_INTERVAL,
      refreshWhenHidden: true,
    }
  );

  // Set to true to show badge, false otherwise.  Badge only shows when not visible.
  const oldData = usePrevious(data);
  React.useEffect(() => {
    if (oldData) {
      const newData = data[0][0].id;
      if (oldData !== newData) {
        setBadge(true);
      }
      if (isVisible) {
        setBadge(false);
      }
    }
  });

  // TODO: need proper error handling
  if (error) {
    console.error('Error loading post data', error);
    return (
      <Container className={classes.root}>
        <Grid
          container
          className={classes.error}
          justify="center"
          alignItems="center"
          direction="column"
        >
          <Grid item>
            <SentimentDissatisfiedRoundedIcon className={classes.errorIcon} />
          </Grid>
          <Grid item>Blog Timeline Failed to Load!</Grid>
        </Grid>
      </Container>
    );
  }

  return (
    <Container className={classes.root}>
      <Timeline pages={data} nextPage={() => setSize(size + 1)} />
    </Container>
  );
};

export default Posts;
