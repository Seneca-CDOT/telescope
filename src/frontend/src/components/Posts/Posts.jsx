import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Container, Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import parse from 'parse-link-header';
import useSiteMetaData from '../../hooks/use-site-metadata';
import Post from '../Post/Post.jsx';
import CustomizedSnackBar from '../SnackBar/SnackBar.jsx';
import Spinner from '../Spinner/Spinner.jsx';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    maxWidth: '785px',
  },
  content: {
    '& > *': {
      color: theme.palette.primary.main,
      borderColor: theme.palette.primary.main,
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
    color: theme.palette.primary,
  },
}));

const Posts = () => {
  const classes = useStyles();
  const savedCallback = useRef();
  const [initNumPosts, setInitNumPosts] = useState(0);
  const [currentNumPosts, setCurrentNumPosts] = useState(0);
  const [shouldCheckForNewPosts, setShouldCheckForNewPosts] = useState(false);
  const [alert, setAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const { telescopeUrl } = useSiteMetaData();
  const [posts, setPosts] = useState([]);
  const [numPages, setNumPages] = useState(1);
  const [endOfPosts, setEndOfPosts] = useState(false);
  const snackbarMessage = 'There is new content available!';

  // Pagination
  const [nextPageLink, setNextPageLink] = useState(`/posts?page=${numPages}`);

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
    // Disabling the eslint check as nextPageLink and posts will cause the page to not render properly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [telescopeUrl, numPages]);

  function getNewPosts() {
    setLoading(true);
    setNumPages(numPages + 1);
  }

  const getPostsCount = useCallback(async () => {
    if (!shouldCheckForNewPosts) {
      return null;
    }
    try {
      const res = await fetch(`${telescopeUrl}/posts`, { method: 'HEAD' });
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.headers.get('x-total-count');
    } catch (error) {
      console.log(error);
    } finally {
      setShouldCheckForNewPosts(false);
    }
    return null;
  }, [telescopeUrl, shouldCheckForNewPosts]);

  const callback = useCallback(async () => {
    setCurrentNumPosts(await getPostsCount());
  }, [getPostsCount]);

  useEffect(() => {
    savedCallback.current = callback;
  });

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
      setShouldCheckForNewPosts(true);
      savedCallback.current();
    }
    savedCallback.current = callback;
    // Polls every 5 minutes
    const interval = setInterval(() => {
      getCurrentNumPosts();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [callback]);

  useEffect(() => {
    function getCurrentNumPosts() {
      setShouldCheckForNewPosts(true);
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
    return 'Load More Posts';
  }

  return posts.length > 0 ? (
    <Container className={classes.root}>
      <Container className={classes.root}>
        {posts.map(({ id, feed, html, title, url, updated }) => (
          <Post
            key={id}
            id={id}
            author={feed.author}
            url={url}
            html={html}
            title={title}
            date={updated}
            link={feed.link}
          />
        ))}
      </Container>
      <Container>
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
      </Container>
    </Container>
  ) : (
    <>
      <Grid container spacing={0} direction="column" alignItems="center" justify="center">
        <Spinner className={classes.activeCircle} />
      </Grid>
    </>
  );
};

Posts.propTypes = {
  className: PropTypes.string,
  posts: PropTypes.array,
};

export default Posts;
