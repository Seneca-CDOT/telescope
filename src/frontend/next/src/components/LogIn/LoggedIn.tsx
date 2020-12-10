import { useContext, Fragment } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, Divider, Grid, useMediaQuery } from '@material-ui/core';
import Link from 'next/link';
import { UserStateContext } from '../../contexts/User/UserContext';

//import useSiteMetadata from '../../hooks/use-site-metadata';
import getStaticProps from '../../hooks/use-site-metadata';

const useStyles = makeStyles((theme: any) => ({
  button: {
    float: 'right',
    margin: '0 0.5rem 0 0.5rem',
  },
  link: {
    textDecoration: 'none',
    fontSize: '1.5rem',
    color: theme.palette.primary.contrastText,
    lineHeight: 1,
  },
  lineHorizontal: {
    backgroundColor: theme.palette.background.default,
    width: '250px',
    margin: '8px',
  },
  lineVertical: {
    margin: '8px',
  },
  item: {
    color: theme.palette.primary.contrastText,
    fontFamily: 'Roboto, sans-serif',
    textDecoration: 'none',
    fontSize: '1.5rem',
    justifyContent: 'center',
    fontWeight: 500,
    lineHeight: 1.75,
    textTransform: 'uppercase',
  },
}));

function LoggedIn() {
  const user = useContext(UserStateContext);
  const { telescopeUrl } = getStaticProps(); // useSiteMetadata()
  const logoutUrl = `${telescopeUrl}/auth/logout`;
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div>
      {matches ? (
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid item xs={12}>
            <Link href="/myfeeds">
              <a className={classes.item}>{user.name}</a>
            </Link>
          </Grid>
          <Divider orientation="horizontal" className={classes.lineHorizontal} />
          <Grid item xs={12}>
            <Button className={classes.button}>
              <a href={logoutUrl} className={classes.link}>
                Logout
              </a>
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item>
            <Link href="/myfeeds">
              <a className={classes.item}>{user.name}</a>
            </Link>
          </Grid>
          <Divider orientation="vertical" className={classes.lineVertical} />
          <Grid item>
            <Button className={classes.button}>
              <a href={logoutUrl} className={classes.link}>
                Logout
              </a>
            </Button>
          </Grid>
        </Grid>
      )}
    </div>
  );
}

export default LoggedIn;
