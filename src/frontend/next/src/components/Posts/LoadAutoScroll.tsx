import { useEffect, createRef } from 'react';
import { Container, Button, Grid, createStyles, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

type Scroll = {
  onScroll: Function;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    content: {
      '& > *': {
        padding: theme.spacing(2),
        bottom: theme.spacing(4),
      },
    },
  })
);

function LoadAutoScroll({ onScroll }: Scroll) {
  const classes = useStyles();
  const $buttonRef = createRef<HTMLButtonElement>();
  // This will make the automatic infinite scrolling feature
  // Once the "button" is on the viewport(shown on the window),
  // The new posts are updated(call onClick() -- setSize(size + 1) in Posts.jsx --)
  useEffect(() => {
    const options = {
      root: null,
      threshold: 1.0,
    };

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onScroll();
          }
        }),
      options
    );
    observer.observe($buttonRef.current!);
    const buttonRefCopy = $buttonRef.current;

    return () => {
      observer.unobserve(buttonRefCopy as HTMLButtonElement);
    };
  }, [$buttonRef, onScroll]);

  return (
    <Container>
      <Grid item xs={12} className={classes.content}>
        <Button ref={$buttonRef}>Load More Posts</Button>
      </Grid>
    </Container>
  );
}

export default LoadAutoScroll;
