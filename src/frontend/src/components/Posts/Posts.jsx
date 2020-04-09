import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useSiteMetaData from '../../hooks/use-site-metadata';
import CustomizedSnackBar from '../SnackBar';

import Post from '../Post/Post.jsx';

const useStyles = makeStyles({
  root: {
    padding: 0,
    maxWidth: '785px',
  },
});

export default function Posts({ posts }) {
  const [initNumPosts, setInitNumPosts] = useState(0);
  const [currentNumPosts, setCurrentNumPosts] = useState(0);
  const savedCallback = useRef();
  const { telescopeUrl } = useSiteMetaData();
  const classes = useStyles();

  async function getPostsCount() {
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
  }

  function callback() {
    getPostsCount()
      .then(setCurrentNumPosts)
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    savedCallback.current = callback;
  });

  // Get the current + initial posts count when page loads
  useEffect(() => {
    async function setPostsInfo() {
      try {
        await Promise.all([
          setInitNumPosts(await getPostsCount()),
          setCurrentNumPosts(await getPostsCount()),
        ]);
      } catch (error) {
        console.log({ error });
      }
    }
    setPostsInfo();
  }, []);

  useEffect(() => {
    function getCurrentNumPosts() {
      savedCallback.current();
    }

    savedCallback.current = callback;
    // Polls every 5 minutes
    const interval = setInterval(getCurrentNumPosts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentNumPosts]);

  return (
    <Container className={classes.root}>
      {currentNumPosts !== initNumPosts ? <CustomizedSnackBar posts={currentNumPosts} /> : null}
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
  );
}

Posts.propTypes = {
  className: PropTypes.string,
  posts: PropTypes.array,
};
