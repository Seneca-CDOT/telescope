import { useRouter } from 'next/router';
import { Card, CardActions, CardContent, Fab, Grid, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { telescopeUrl } from '../config';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'absolute',
    [theme.breakpoints.between('xs', 'sm')]: {
      top: '0',
    },
    top: '45vh',
  },
  root: {
    zIndex: 100,
    padding: theme.spacing(2, 4, 2, 4),
    position: 'relative',
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
    borderRadius: theme.spacing(1),
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.5rem',
    margin: '0 0.5rem 0 0.5rem',
  },
  fab: {
    position: 'relative',
    fontSize: '1.5rem',
    color: theme.palette.text.primary,
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

type ErrorProps = {
  message: string | null;
  status: number | null;
};

function InnerErrorContent({ message, status }: ErrorProps) {
  const classes = useStyles();

  let errorMessage;

  switch (status) {
    case 400:
      errorMessage = 'We did not understand the request!';
      break;
    case 401:
      errorMessage = 'You are not authorized to view this page!';
      break;
    case 403:
      errorMessage = 'Access is not allowed for the requested page!';
      break;
    case 404:
      errorMessage = 'We could not find what you were looking for!';
      break;
    case 405:
      errorMessage = 'Method is not allowed!';
      break;
    default:
      errorMessage = 'Something went wrong!';
  }

  // If server doesn't send us a custom message, use ones defined above.
  if (!message) {
    return (
      <Typography variant="body1" className={classes.h2}>
        {errorMessage}
      </Typography>
    );
  }
  return (
    <Typography variant="body1" className={classes.h3}>
      {message}
    </Typography>
  );
}

const ErrorPage = () => {
  const classes = useStyles();
  const router = useRouter();

  const location = new URL(router.asPath, telescopeUrl);
  const params = new URLSearchParams(location.search);

  const status = params.get('status') ? Number(params.get('status')) : null;
  const message = params.get('message');

  return (
    <>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        className={classes.container}
      >
        <Grid item xs={8}>
          <Card className={classes.root} elevation={6}>
            <CardContent>
              <Typography variant="h1" className={classes.h1}>
                {status}
              </Typography>

              <InnerErrorContent status={status} message={message} />
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
                  Let&apos;s Go Back
                </Typography>
              </Fab>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default ErrorPage;
