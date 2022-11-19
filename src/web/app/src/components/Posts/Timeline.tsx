import { ReactElement, MouseEvent } from 'react';
import { render } from 'react-dom';
import { Container, createStyles } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import PostComponent from './Post';
import { Post } from '@interfaces';
import LoadAutoScroll from './LoadAutoScroll';
import CopyButton from './CopyButton';

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

function copyCode(codeSnippet: string) {
  if (navigator) {
    navigator.clipboard.writeText(codeSnippet);
  }
}

function isCodeBlock(elem: Element) {
  return elem.tagName === 'CODE' && elem.parentElement?.tagName === 'PRE';
}

function removeButton(parent: HTMLElement) {
  parent.querySelectorAll('.copyCodeBtn').forEach((button) => button.remove());
}
function createCopyButton(parent: HTMLElement, onClick: (e: MouseEvent) => void) {
  render(
    <CopyButton
      className="copyCodeBtn"
      style={{
        position: 'absolute',
        right: 0,
        padding: '1rem',
        marginRight: '1.5rem',
        transitionDuration: '0.2s',
        transitionTimingFunction: 'ease',
        cursor: 'pointer',
        animation: 'fade-in-out 200ms both',
        fontSize: '2rem',
        color: 'inherit',
      }}
      onClick={onClick}
      beforeCopyMessage="Copy code block"
    />,
    parent
  );
}

function handleMouseMove(e: MouseEvent) {
  // if mouse hovers <code></code>, we call createCopyButton(e)
  if (e.target instanceof HTMLElement && isCodeBlock(e.target)) {
    e.preventDefault();
    const snippet = e.target; // code tag
    const parentDiv = snippet.parentElement; // pre tag

    // There is no content to be copied
    if (!parentDiv || !snippet.textContent) {
      return;
    }

    // check if a button has already been added
    if (parentDiv.querySelector('.copyCodeBtn')) {
      return;
    }

    const button = document.createElement('div');
    createCopyButton(button, () => copyCode(snippet.textContent!));
    parentDiv.insertBefore(button, snippet);
    parentDiv.onmouseleave = () => removeButton(parentDiv);
  }
}

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

  return (
    <div onMouseMove={handleMouseMove}>
      <Container className={classes.root}>{postsTimeline}</Container>
    </div>
  );
};

export default Timeline;
