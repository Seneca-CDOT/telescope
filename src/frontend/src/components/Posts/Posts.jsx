import React, { useEffect, useState } from 'react';
import { useSWRInfinite } from 'swr';
import { Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { usePrevious } from 'react-use';
import SentimentDissatisfiedRoundedIcon from '@material-ui/icons/SentimentDissatisfiedRounded';
import Timeline from './Timeline.jsx';
import useSiteMetaData from '../../hooks/use-site-metadata';
import useFaviconBadge from '../../hooks/use-favicon-badge';

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

// Refresh post data every 5 mins
const REFRESH_INTERVAL = 5 * 60 * 1000;

const Posts = () => {
  const classes = useStyles();
  const { telescopeUrl } = useSiteMetaData();
  const [currentPostId, setCurrentPostId] = useState(null);
  const { data, size, setSize, error } = useSWRInfinite(
    (index) => `${telescopeUrl}/posts?page=${index + 1}`,
    (url) => fetch(url).then((r) => r.json()),
    {
      refreshInterval: REFRESH_INTERVAL,
      refreshWhenHidden: true,
      onSuccess(newData) {
        const safelyExtractId = () => {
          try {
            return newData[0][0].id;
          } catch (err) {
            return null;
          }
        };

        // Get the id of the top post in the current and prev data sets
        const id = safelyExtractId();
        setCurrentPostId(id);
      },
    }
  );
  // Also track the previous top post id
  const prevPostId = usePrevious(currentPostId);

  // Manage the favicon badge, depending on whether we have new data or not
  const setBadgeHint = useFaviconBadge();
  useEffect(() => {
    if (currentPostId && currentPostId !== prevPostId) {
      setBadgeHint();
    }
  }, [currentPostId, prevPostId, setBadgeHint]);

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
