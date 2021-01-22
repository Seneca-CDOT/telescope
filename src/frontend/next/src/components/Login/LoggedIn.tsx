import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, Divider, Grid, useMediaQuery } from '@material-ui/core';
import Link from 'next/link';

import { useUser } from '../UserProvider';
import config from '../../config';

const useStyles = makeStyles((theme) => ({
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

const LoggedIn = () => {
  const logoutUrl = `${config.telescopeUrl}/auth/logout`;
  const classes = useStyles();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));
  const { name } = useUser();

  return (
    <div>
      {matches ? (
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid item xs={12}>
            <Link href="/myfeeds">
              <span className={classes.item}>{name}</span>
            </Link>
          </Grid>
          <Divider orientation="horizontal" className={classes.lineHorizontal} />
          <Grid item xs={12}>
            <Button className={classes.button} href={logoutUrl}>
              Logout
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item>
            <Link href="/myfeeds">
              <span className={classes.item}>{name}</span>
            </Link>
          </Grid>
          <Divider orientation="vertical" className={classes.lineVertical} />
          <Grid item>
            <Button className={classes.button} href={logoutUrl}>
              Logout
            </Button>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default LoggedIn;
