import { makeStyles } from '@material-ui/core/styles';
import { ListItem, Button, Divider } from '@material-ui/core';
import Link from 'next/link';
import { useAuthenticatedUser } from '../UserProvider';
import config from '../../config';

const useStyles = makeStyles((theme) => ({
  list: {
    width: 250,
  },
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
  line: {
    backgroundColor: theme.palette.background.default,
  },
  item: {
    justifyContent: 'center',
    lineHeight: 1.75,
  },
  span: {
    textTransform: 'uppercase',
  },
}));

type LoginProps = {
  isMobile?: boolean;
};

const LoggedIn = ({ isMobile = false }: LoginProps) => {
  const classes = useStyles();
  const user = useAuthenticatedUser();
  const { logoutUrl } = config;

  if (!user) {
    return null;
  }

  const { name } = user;
  return (
    <>
      {isMobile ? (
        <div className={classes.list}>
          <Link href="/myfeeds" passHref>
            <ListItem button className={classes.item} component="a">
              <div className={classes.buttonText}>
                <span className={classes.span}>{name}</span>
              </div>
            </ListItem>
          </Link>

          <Divider className={classes.line} />

          <Link href={logoutUrl} passHref>
            <ListItem button className={classes.item} component="a">
              <p className={classes.buttonText}>Log Out</p>
            </ListItem>
          </Link>
        </div>
      ) : (
        <>
          <Link href="/myfeeds" passHref>
            <Button color="inherit" size="medium" className={classes.button} component="a">
              <div className={classes.buttonText}>
                <span className={classes.span}>{name}</span>
              </div>
            </Button>
          </Link>

          <Link href="/about" passHref>
            <Button color="inherit" size="medium" className={classes.button} component="a">
              <p className={classes.buttonText}>Log Out</p>
            </Button>
          </Link>
        </>
      )}
    </>
  );
};

export default LoggedIn;
