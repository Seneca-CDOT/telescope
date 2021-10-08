import { useState, useEffect } from 'react';
import useSWRInfinite from 'swr/infinite';
import { Container, createStyles, Grid } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { usePrevious } from 'react-use';
import SentimentDissatisfiedRoundedIcon from '@material-ui/icons/SentimentDissatisfiedRounded';
import Timeline from './Timeline';
import { postsServiceUrl } from '../../config';
import useFaviconBadge from '../../hooks/use-favicon-badge';
import { Post } from '../../interfaces';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0',
      backgroundColor: theme.palette.background.default,
      color: 'white',
      width: '100%',
    },
    postsWrapper: {
      width: '100%',
    },
    error: {
      color: '#B5B5B5',
      fontSize: '5rem',
      paddingBottom: '30px',
    },
    errorIcon: {
      color: '#B5B5B5',
      fontSize: '10rem',
      paddingBottom: '0',
    },
  })
);

// Refresh post data every 5 mins
const REFRESH_INTERVAL = 5 * 60 * 1000;

const Posts = () => {
  const classes = useStyles();
  const [currentPostId, setCurrentPostId] = useState<string | null>();

  const { data, size, setSize, error } = useSWRInfinite<Post[]>(
    (index: number) => `${postsServiceUrl}/?page=${index + 1}`,
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
      <div className={classes.root}>
        <Container>
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
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.postsWrapper}>
        <Timeline pages={data} nextPage={() => setSize(size + 1)} />
      </div>
    </div>
  );
};

export default Posts;
