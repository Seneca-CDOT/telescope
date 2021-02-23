import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Link from 'next/link';
import config from '../../config';

const useStyles = makeStyles((theme) => ({
  button: {
    float: 'right',
    margin: '0 0.5rem 0 0.5rem',
  },
  buttonText: {
    textDecoration: 'none',
    fontSize: '1.5rem',
    color: theme.palette.primary.contrastText,
    margin: '0 0.5rem 0 0.5rem',
    fontFamily: 'Roboto, sans-serif',
  },
  icon: {
    fontSize: '2.5rem',
  },
}));

const LoggedOut = () => {
  const classes = useStyles();
  const { loginUrl } = config;

  return (
    <>
      <Link href={loginUrl} passHref>
        <IconButton color="inherit" className={classes.button} aria-label="log in" component="a">
          <ExitToAppIcon className={classes.icon} />
        </IconButton>
      </Link>
    </>
  );
};

export default LoggedOut;
