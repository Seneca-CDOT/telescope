import React from 'react';
import PropTypes from 'prop-types';
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Post from '../Post/Post.jsx';

const useStyles = makeStyles({
  root: {
    padding: 0,
    maxWidth: '785px',
  },
});

const Posts = ({ posts }) => {
  const classes = useStyles();

  return (
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
        />
      ))}
    </Container>
  );
};

Posts.propTypes = {
  className: PropTypes.string,
  posts: PropTypes.array,
};

export default Posts;
