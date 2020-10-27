import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { Link } from 'gatsby';
import DynamicImage from '../DynamicImage/DynamicImage.jsx';

const useStyles = makeStyles((theme) => ({
  dynamic: {
    transition: 'opacity 1s ease-in-out',
    backgroundColor: theme.palette.primary.main,
    opacity: 0.9,
  },
  stats: {
    position: 'absolute',
    color: theme.palette.text.primary,
    fontFamily: 'Roboto',
    fontSize: '2rem',
    display: 'block',
    bottom: theme.spacing(12),
    left: theme.spacing(8),
    right: theme.spacing(8),
    lineHeight: 'inherit',
    letterSpacing: 'inherit',
    transition: 'all linear 1s',
    [theme.breakpoints.between('xs', 'sm')]: {
      textAlign: 'left',
      fontSize: '2rem',
      left: theme.spacing(4),
      right: theme.spacing(4),
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: '4rem',
    },
    [theme.breakpoints.up('xl')]: {
      fontSize: '8rem',
    },
  },
  addYours: {
    color: theme.palette.text.primary,
    textDecorationLine: 'underline',
  },
}));

function BannerDynamicText() {
  const classes = useStyles();

  return (
    <div className={classes.dynamic}>
      <DynamicImage />
      <Typography variant="caption" className={classes.stats}>
        This year 83 of us have written over 250K words and counting.{' '}
        <Link className={classes.addYours} to="/myfeeds">
          Add yours!
        </Link>
      </Typography>
    </div>
  );
}

export default BannerDynamicText;
