import React from 'react';
import PropTypes from 'prop-types';

import { Container, Button, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
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
}));

function LoadMoreButton({ onClick }) {
  const classes = useStyles();
  const $buttonRef = React.useRef(null);

  // This will make the automatic infinite scrolling feature
  // Once the "button" is on the viewpoint(shown on the window),
  // The new posts are updated(call onClick() -- setSize(size + 1) in Posts.jsx --)
  React.useEffect(() => {
    let options = {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    };

    let observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onClick();
        }
      });
    }, options);
    observer.observe($buttonRef.current);

    return () => {
      observer.unobserve($buttonRef.current);
    };
  }, []);

  return (
    <Container>
      <Grid container spacing={0} direction="column" alignItems="center" justify="center">
        <Grid item xs={12} className={classes.content}>
          <Button ref={$buttonRef} color="primary" variant="outlined" onClick={() => onClick()}>
            Load More Posts
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

LoadMoreButton.propTypes = {
  onClick: PropTypes.func,
};

export default LoadMoreButton;
