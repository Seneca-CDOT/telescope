import React, { useEffect, useState, useRef, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CircularProgress, Button, Grid } from '@material-ui/core';
import parse from 'parse-link-header';

import PageBase from './PageBase';
import Banner from '../components/Banner';
import Posts from '../components/Posts';
import ScrollToTop from '../components/ScrollToTop';
import useSiteMetaData from '../hooks/use-site-metadata';
import CustomizedSnackBar from '../components/SnackBar';

const useStyles = makeStyles((theme) => ({
  content: {
    '& > *': {
      /**
       * We, the implementors of this CSS realize how morally wrong it is
       * to use !important in any case. That does not excuse the hour long
       * Fight while finding other ways
       */
      color: `${theme.palette.secondary.light} !important`,
      borderColor: `${theme.palette.secondary.light} !important`,
      padding: theme.spacing(2),
      bottom: theme.spacing(4),
      fontSize: '2rem',
      transition: 'all linear 250ms',

      [theme.breakpoints.between('xs', 'sm')]: {
        bottom: theme.spacing(8),
      },
    },
  },
  activeCircle: {
    borderRadius: '4rem',
    transition: 'all linear 250ms',
    color: theme.palette.primary.light,
  },
}));

export default function IndexPage() {
  const [numPages, setNumPages] = useState(1);
  const [posts, setPosts] = useState([]);
  const [initNumPosts, setInitNumPosts] = useState(0);
  const [currentNumPosts, setCurrentNumPosts] = useState(0);
  const [endOfPosts, setEndOfPosts] = useState(true);
  const [alert, setAlert] = useState(false);
  const { telescopeUrl } = useSiteMetaData();
  const savedCallback = useRef();
  const snackbarMessage = 'There is new content available!';

  // Pagination
  const [nextPageLink, setNextPageLink] = useState(`/posts?page=${numPages}`);
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    async function getPosts() {
      try {
        setLoading(true);
        const res = await fetch(`${telescopeUrl}${nextPageLink}`);

        if (!res.ok) {
          throw new Error(res.statusText);
        }

        const postUrls = await res.json();
        const links = parse(res.headers.get('Link'));
        const postsData = await Promise.all(
          postUrls.map(({ url }) => fetch(`${telescopeUrl}${url}`).then((resp) => resp.json()))
        );

        setPosts([...posts, ...postsData]);
        setNextPageLink(links.next.url);

        // When we reach the end, disable the next-button UI
        setEndOfPosts(links.next.url === links.last.url);
      } catch (error) {
        console.log('Something went wrong when fetching data', error);
      } finally {
        setLoading(false);
      }
    }

    getPosts();
  }, [telescopeUrl, numPages]);

  function getNewPosts() {
    setLoading(true);
    setNumPages(numPages + 1);
  }

  const getPostsCount = useCallback(async () => {
    try {
      const res = await fetch(`${telescopeUrl}/posts`, { method: 'HEAD' });
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.headers.get('x-total-count');
    } catch (error) {
      console.log(error);
    }
    return null;
  }, [telescopeUrl]);

  const callback = useCallback(async () => {
    setCurrentNumPosts(await getPostsCount());
  }, [getPostsCount]);

  useEffect(() => {
    savedCallback.current = callback;
  });

  // Get the initial posts count when currentNumPosts value changes (re-render)
  useEffect(() => {
    async function setPostsInfo() {
      try {
        setInitNumPosts(await getPostsCount());
      } catch (error) {
        console.log({ error });
      }
    }
    setPostsInfo();
  }, [getPostsCount, currentNumPosts]);

  useEffect(() => {
    function getCurrentNumPosts() {
      savedCallback.current();
    }
    savedCallback.current = callback;
    // Polls every 5 minutes
    const interval = setInterval(getCurrentNumPosts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [callback]);

  useEffect(() => {
    // Prevents alert from appearing upon page loading.
    // Also checks whether there are new posts available
    if (!loading && currentNumPosts !== initNumPosts && currentNumPosts !== 0) {
      setAlert(true);
    } else {
      setAlert(false);
    }
  }, [currentNumPosts, initNumPosts, loading]);

  function GenerateLoadButtonContent() {
    if (endOfPosts) {
      return 'No more posts.  Your turn! Add your feed...';
    }
    if (loading) {
      return <CircularProgress color="secondary" size={24} />;
    }
    return 'Load More Posts';
  }

  return (
    <PageBase title="Home">
      <Banner />
      <ScrollToTop />
      <main className="main">
        <Posts posts={posts} />

        <Grid container spacing={0} direction="column" alignItems="center" justify="center">
          <Grid item xs={12} className={classes.content}>
            <Button
              color="primary"
              disabled={endOfPosts}
              variant="outlined"
              className={`${loading ? classes.activeCircle : ''}`}
              onClick={() => getNewPosts()}
            >
              <GenerateLoadButtonContent />
            </Button>
          </Grid>
        </Grid>

        {alert ? <CustomizedSnackBar posts={currentNumPosts} message={snackbarMessage} /> : null}
      </main>
    </PageBase>
  );
}
