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
      maxWidth: '785px',
    },
    activeCircle: {
      borderRadius: '4rem',
      transition: 'all linear 250ms',
      color: theme.palette.primary.main,
    },
  })
);

const Timeline = ({ pages, nextPage }: Props) => {
  const classes = useStyles();
  const { telescopeUrl } = useSiteMetaData();

  if (!pages) {
    return null;
  }

  // Iterate over all the pages (an array of arrays) and then convert all post
  // elements to <Post>
  const postsTimeline = pages.map((page: Post[]): Array<ReactElement> | ReactElement =>
    page.map(({ id, url }: Post) => <PostComponent postUrl={`${telescopeUrl}${url}`} key={id} />)
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

export default Timeline;
