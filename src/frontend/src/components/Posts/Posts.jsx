import React from 'react';
import PropTypes from 'prop-types';
import useSWR from 'swr';

import { Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useSiteMetaData from '../../hooks/use-site-metadata';
import Post from '../Post/Post.jsx';
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

const Posts = (props) => {
  const classes = useStyles();
  const { telescopeUrl } = useSiteMetaData();
  const { searchPostResults } = props;

  if (searchPostResults) {
    setPosts(searchPostResults);
  } else {
    getPosts();
  }

  const { data: posts, error } = useSWR(`${telescopeUrl}/posts`, (url) =>
    fetch(url).then((r) => r.json())
  );

  if (error) {
    console.error('Error loading posts', error);
    return null;
  }

  if (!posts) {
    return <div>Loading...</div>;
  }

  if (posts.length === 0) {
    return (
      <>
        <Grid container spacing={0} direction="column" alignItems="center" justify="center">
          <Spinner className={classes.activeCircle} />
        </Grid>
      </>
    );
  }

  return (
    <Container className={classes.root}>
      <Container className={classes.root}>
        {posts.map(({ id, url }) => (
          <Post postUrl={`${telescopeUrl}${url}`} key={id} />
        ))}
      </Container>
    </Container>
  );
};

Posts.propTypes = {
  className: PropTypes.string,
  searchResults: PropTypes.array,
};

export default Posts;
