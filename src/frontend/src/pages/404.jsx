import React from 'react';
import Header from '../components/Header';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  h1: {
    position: 'absolute',
    color: 'white',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    opacity: 0.85,
    fontSize: '12rem',
    display: 'block',
    top: theme.spacing(20),
    left: theme.spacing(8),
    [theme.breakpoints.between('xs', 'sm')]: {
      fontSize: '4rem',
      textAlign: 'left',
      left: theme.spacing(4),
      right: theme.spacing(4),
      top: theme.spacing(14),
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: '8rem',
    },
    [theme.breakpoints.up('xl')]: {
      fontSize: '12rem',
    },
  },
  h2: {
    position: 'absolute',
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: '2rem',
    display: 'block',
    bottom: theme.spacing(12),
    left: theme.spacing(8),
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
}));

const ErrorPage = (props) => {
  const classes = useStyles();
  const params = new URLSearchParams(props.location.search);
  let originalUrl = params
    .get('search')
    ?.replace('/', '')
    ?.match(/([A-Z]?[^A-Z]*)/g)
    ?.slice(0, -1)
    ?.join(' ');

  return (
    <div>
      <Header />
      <ThemeProvider>
        <Typography variant="h1" className={classes.h1}>
          Sorry!
        </Typography>
        <Typography variant="body1" className={classes.h2}>
          Could Not Find: <pre>{originalUrl}</pre>
        </Typography>
      </ThemeProvider>
    </div>
  );
};

export default ErrorPage;
