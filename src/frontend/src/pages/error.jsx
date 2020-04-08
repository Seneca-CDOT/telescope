import React from 'react';
import PageBase from './PageBase';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { Fab } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import DynamicBackgroundContainer from '../components/DynamicBackgroundContainer';
import url from 'url';

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: 'Roboto',
    display: 'block',
    zIndex: 100,
    padding: theme.spacing(2, 4, 2, 4),
    position: 'relative',
    top: '40vh',
    margin: 'auto',
    backgroundColor: theme.palette.primary.main,
    overflow: 'visible',
    [theme.breakpoints.between('xs', 'sm')]: {
      top: theme.spacing(24),
    },
  },
  h1: {
    fontWeight: 'bold',
    opacity: 0.85,
    color: theme.palette.grey[100],
    fontSize: '12rem',
    [theme.breakpoints.between('xs', 'sm')]: {
      fontSize: '4rem',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: '8rem',
    },
    [theme.breakpoints.up('xl')]: {
      fontSize: '12rem',
    },
  },
  h2: {
    fontSize: '2rem',
    color: theme.palette.grey[200],
    marginTop: '1.75rem',
    lineHeight: 'inherit',
    letterSpacing: 'inherit',
    transition: 'all linear 350ms',
    [theme.breakpoints.between('xs', 'sm')]: {
      fontSize: '2rem',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: '4rem',
    },
    [theme.breakpoints.up('xl')]: {
      fontSize: '8rem',
    },
  },
  h3: {
    fontFamily: 'monospace',
    fontSize: '2rem',
    padding: theme.spacing(4),
    color: theme.palette.grey[300],
    // backgroundColor: theme.palette.error.light,
    borderRadius: theme.spacing(1),
  },
  link: {
    color: 'white',
    fontFamily: 'Roboto, sans-serif',
    textDecoration: 'none',
    fontSize: '1.5rem',
    margin: '0 0.5rem 0 0.5rem',
  },
  fab: {
    position: 'relative',
    fontSize: '1.5rem',
    color: 'white',
    bottom: -45,
    zIndex: 200,
    backgroundColor: theme.palette.secondary.light,
    transition: 'all linear 250ms',
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark,
    },
    [theme.breakpoints.between('xs', 'sm')]: {
      right: '-2rem',
    },
  },

  buttonText: {
    fontSize: '1.5rem',
    paddingLeft: theme.spacing(1),
    [theme.breakpoints.between('xs', 'sm')]: {
      display: 'none',
    },
  },
}));

function CreateInnerErrorContent(props) {
  const classes = useStyles();

  const errorMessages = {
    '400': 'We did not understand the request!',
    '401': 'You are not authorized to view this page!',
    '403': 'Access is not allowed for the requested page!',
    '404': 'We could not find what you were looking for!',
    '405': 'Method is not allowed!',
  };

  if (props.status != '500' && !props.message) {
    return (
      <Typography variant="body1" className={classes.h2}>
        {errorMessages[props.status]}{' '}
      </Typography>
    );
  }
  return (
    <Typography variant="body1" className={classes.h3}>
      {props.message}
    </Typography>
  );
}

const ErrorPage = (props) => {
  const classes = useStyles();
  const params = new URLSearchParams(document.location.search);
  const status = params.get('status');
  const message = params.get('message');

  console.log(message);

  return (
    <PageBase title={status}>
      <Grid container spacing={0} direction="column" alignItems="center" justify="center">
        <Grid item xs={8}>
          <ThemeProvider>
            <Card className={classes.root} elevation={6}>
              <CardContent>
                <Typography variant="h1" className={classes.h1}>
                  {status}
                </Typography>

                <CreateInnerErrorContent status={status} message={message} />
              </CardContent>

              <CardActions
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  transition: 'all linear 350ms',
                }}
              >
                <Fab variant="extended" href="/" className={classes.fab}>
                  <ArrowBack />
                  <Typography variant="body2" className={classes.buttonText}>
                    Let's Go Back
                  </Typography>
                </Fab>
              </CardActions>
            </Card>
          </ThemeProvider>
        </Grid>
      </Grid>
      <DynamicBackgroundContainer />
    </PageBase>
  );
};

export default ErrorPage;
