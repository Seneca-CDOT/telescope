import React, { useEffect, useState } from 'react';
import PageBase from './PageBase';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import { Fab } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles((theme) => ({
  root: {
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
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    opacity: 0.85,
    color: theme.palette.grey[100],
    fontSize: '12rem',
    display: 'block',
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
    fontFamily: 'Roboto',
    fontSize: '2rem',
    display: 'block',
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
  link: {
    color: 'white',
    fontFamily: 'Roboto, sans-serif',
    textDecoration: 'none',
    fontSize: '1.5rem',
    margin: '0 0.5rem 0 0.5rem',
  },
  errorImg: {
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'scroll',
    backgroundSize: 'cover',
    height: 'calc(100vh - 6em)',
    transition: 'opacity 1s ease-in-out',
    position: 'absolute',
    height: '100vh',
    width: '100vw',
    top: 0,
  },
  fab: {
    position: 'relative',
    fontSize: '1.5rem',
    color: 'white',
    bottom: -45,
    zIndex: 200,
    backgroundColor: '#57395e',
    transition: 'all linear 250ms',
    '&:hover': {
      backgroundColor: '#44234c',
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

function RetrieveBackgroundAsset() {
  const [backgroundImgSrc, setBackgroundImgSrc] = useState('');
  const [transitionBackground, setTransitionBackground] = useState(true);
  const classes = useStyles();

  useEffect(() => {
    async function getBackgroundImgSrc() {
      // Uses https://unsplash.com/collections/1538150/milkyway collection
      /* Other Options:
        - https://unsplash.com/collections/291422/night-lights
        */

      // Ensure we are using an image which fits correctly to user's viewspace
      const dimensions = `${window.innerWidth}x${window.innerHeight}`;
      const response = await fetch(`https://source.unsplash.com/collection/1538150/${dimensions}`);

      if (response.status !== 200) {
        setBackgroundImgSrc('../../images/hero-banner.png');
        throw new Error(response.statusText);
      }

      setBackgroundImgSrc(response.url);
      setTransitionBackground(false);
    }

    getBackgroundImgSrc();
  }, []);

  return (
    <div
      className={classes.errorImg}
      style={{
        backgroundImage: `url(${backgroundImgSrc})`,
        opacity: transitionBackground ? 0 : 0.4,
      }}
    ></div>
  );
}

const ErrorPage = (props) => {
  const classes = useStyles();

  return (
    <PageBase title="404">
      <Grid container spacing={0} direction="column" alignItems="center" justify="center">
        <Grid item xs={8}>
          <ThemeProvider>
            <Card className={classes.root} elevation={6}>
              <CardContent>
                <Typography variant="h1" className={classes.h1}>
                  404
                </Typography>
                <Typography variant="body1" className={classes.h2}>
                  We Could Not Find What You Were Looking For!
                </Typography>
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
      <RetrieveBackgroundAsset />
    </PageBase>
  );
};

export default ErrorPage;
