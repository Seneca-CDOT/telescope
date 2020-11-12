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
  container: {
    [theme.breakpoints.between('xs', 'sm')]: {
      paddingTop: theme.spacing(4),
    },
  },
}));

function LoadMoreButton({ onClick }) {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <Grid container spacing={0} direction="column" alignItems="center" justify="center">
        <Grid item xs={12} className={classes.content}>
          <Button color="primary" variant="outlined" onClick={() => onClick()}>
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
