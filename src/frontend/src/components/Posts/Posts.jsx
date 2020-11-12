import React from 'react';
import { useSWRInfinite } from 'swr';

import { Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SentimentDissatisfiedRoundedIcon from '@material-ui/icons/SentimentDissatisfiedRounded';
import Timeline from './Timeline.jsx';
import useSiteMetaData from '../../hooks/use-site-metadata';

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

const REFRESH_INTERVAL = 5 * 60 * 1000; /* refresh data every 5 minutes */

const Posts = () => {
  const classes = useStyles();
  const { telescopeUrl } = useSiteMetaData();
  const { data, size, setSize, error } = useSWRInfinite(
    (index) => `${telescopeUrl}/posts?page=${index + 1}`,
    (url) => fetch(url).then((r) => r.json()),
    {
      refreshInterval: REFRESH_INTERVAL,
    }
  );

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
