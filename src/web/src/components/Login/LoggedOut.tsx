import { makeStyles } from '@material-ui/core/styles';
import { Button, ListItem } from '@material-ui/core';
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
  item: {
    justifyContent: 'center',
    lineHeight: 1.75,
  },
}));

type LoginProps = {
  isMobile?: boolean;
};

const LoggedOut = ({ isMobile = false }: LoginProps) => {
  const classes = useStyles();
  const { loginUrl } = config;

  return (
    <>
      {isMobile ? (
        <Link href={loginUrl} passHref>
          <ListItem button component="a" className={classes.item}>
            <p className={classes.buttonText}>Log in</p>
          </ListItem>
        </Link>
      ) : (
        <Link href={loginUrl} passHref>
          <Button size="medium" className={classes.button} component="a">
            <p className={classes.buttonText}>Log in</p>
          </Button>
        </Link>
      )}
    </>
  );
};

export default LoggedOut;
