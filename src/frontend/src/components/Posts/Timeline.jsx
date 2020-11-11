import React from 'react';
import PropTypes from 'prop-types';

import { Container, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Post from '../Post/Post.jsx';
import Spinner from '../Spinner/Spinner.jsx';

import LoadAutoScroll from './LoadAutoScroll';
import useSiteMetaData from '../../hooks/use-site-metadata';

const useStyles = makeStyles((theme) => ({
  activeCircle: {
    borderRadius: '4rem',
    transition: 'all linear 250ms',
    color: theme.palette.primary,
  },
}));

const Timeline = ({ pages, nextPage }) => {
  const classes = useStyles();
  const { telescopeUrl } = useSiteMetaData();

  if (!(pages && pages.length)) {
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
  const postsTimeline = pages.map((page) =>
    page.map(({ id, url }) => <Post postUrl={`${telescopeUrl}${url}`} key={id} />)
  );

  // Add a "Load More" button at the end of the timeline.  Give it a unique
  // key each time, based on page (i.e., size), so we remove the previous one
  if (nextPage) {
    postsTimeline.push(
      <LoadAutoScroll onScroll={() => nextPage()} key={`load-more-button-${pages.length}`} />
    );
  }

  return <Container className={classes.root}>{postsTimeline}</Container>;
};

Timeline.propTypes = {
  pages: PropTypes.array,
  nextPage: PropTypes.func,
};

export default Timeline;
