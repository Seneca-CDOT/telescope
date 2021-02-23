import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Link from 'next/link';
import { useAuthenticatedUser } from '../UserProvider';
import config from '../../config';

const useStyles = makeStyles(() => ({
  button: {
    float: 'right',
    margin: '0 0.5rem 0 0.5rem',
  },
  icon: {
    fontSize: '2.5rem',
  },
}));

const LoggedIn = () => {
  const classes = useStyles();
  const user = useAuthenticatedUser();
  const { logoutUrl } = config;

  if (!user) {
    return null;
  }

  return (
    <>
      <Link href="/myfeeds" passHref>
        <IconButton color="inherit" className={classes.button} aria-label="my feeds" component="a">
          <AccountCircleIcon className={classes.icon} />
        </IconButton>
      </Link>

      <Link href={logoutUrl} passHref>
        <IconButton color="inherit" className={classes.button} aria-label="log out" component="a">
          <PowerSettingsNewIcon className={classes.icon} />
        </IconButton>
      </Link>
    </>
  );
};

export default LoggedIn;
