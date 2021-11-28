import { ReactElement } from 'react';
import { Container, createStyles } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import PostComponent from './Post';
import { Post } from '../../interfaces';
import LoadAutoScroll from './LoadAutoScroll';

type Props = {
  pages: Post[][] | undefined;
  totalPosts?: number;
  nextPage: Function;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0',
      width: '800px',
      [theme.breakpoints.down(1024)]: {
        width: '90%',
      },
    },
    noMorePosts: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      padding: '2rem',
      fontFamily: 'Spartan',
      color: theme.palette.primary.main,
      [theme.breakpoints.down(1024)]: {
        paddingBottom: 'calc(84px + env(safe-area-inset-bottom))',
      },
      [theme.breakpoints.down(600)]: {
        paddingBottom: 'calc(76px + env(safe-area-inset-bottom))',
      },
    },
  })
);

const Timeline = ({ pages, totalPosts, nextPage }: Props) => {
  const classes = useStyles();

  if (!pages) {
    return null;
  }

  // There no more posts when the last page has no posts
  const isReachingEnd = !pages?.[pages.length - 1]?.length;

  // the length of first array
  const firstLength = pages[0].length;
  const getCurrentPost = (pageIndex: number, postIndex: number): number => {
    // this function takes 2 indexes from the 2-d posts array and length of the first array
    return pageIndex * firstLength + postIndex + 1;
  };

  const postsTimeline = pages.map((page, pageIndex): Array<ReactElement> | ReactElement =>
    page.map(({ id, url }, postIndex) => {
      return (
        <PostComponent
          postUrl={url}
          key={id}
          currentPost={getCurrentPost(pageIndex, postIndex)}
          totalPosts={totalPosts}
        />
      );
    })
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
