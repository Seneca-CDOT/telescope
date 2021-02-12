import { ReactElement } from 'react';
import { Container, createStyles } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import PostComponent from './Post';
import { Post } from '../../interfaces';
import LoadAutoScroll from './LoadAutoScroll';
import useSiteMetaData from '../../hooks/use-site-metadata';

type Props = {
  pages: Post[][] | undefined;
  nextPage: Function;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 0,
      // float: 'right',
      width: '60%',
      border: '15px solid yellow',
    },
    activeCircle: {
      // REMOVE THIS CLASS
      borderRadius: '4rem',
      transition: 'all linear 250ms',
      color: theme.palette.primary.main,
    },
    noMorePosts: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      margin: '2rem',
    },
  })
);

const Timeline = ({ pages, nextPage }: Props) => {
  const classes = useStyles();
  const { telescopeUrl } = useSiteMetaData();

  if (!pages) {
    return null;
  }

  // There no more posts when the last page has no posts
  const isReachingEnd = !pages?.[pages.length - 1]?.length;

  // Iterate over all the pages (an array of arrays) and then convert all post
  // elements to <Post>
  const postsTimeline = pages.map((page: Post[]): Array<ReactElement> | ReactElement =>
    page.map(({ id, url }: Post) => <PostComponent postUrl={`${telescopeUrl}${url}`} key={id} />)
  );

  // Add a "Load More" button at the end of the timeline.  Give it a unique
  // key each time, based on page (i.e., size), so we remove the previous one
  if (!isReachingEnd) {
    postsTimeline.push(
      <LoadAutoScroll onScroll={() => nextPage()} key={`load-more-button-${pages.length}`} />
    );
  } else {
    postsTimeline.push(
      <div className={classes.noMorePosts}>
        <h1>No more posts found</h1>
      </div>
    );
  }

  return <Container className={classes.root}>{postsTimeline}</Container>;
};

export default Timeline;
