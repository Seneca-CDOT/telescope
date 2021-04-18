import Link from 'next/link';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import useAuth from '../hooks/use-auth';
import TelescopeAvatar from './TelescopeAvatar';

const useStyles = makeStyles((theme) => ({
  buttonsContainer: {
    position: 'absolute',
    color: 'white',
    top: '20px',
    width: '250px',
    right: '5%',
    display: 'flex',
    justifyContent: 'space-around',
    '& > .MuiButton-root': {
      color: 'white',
      border: '1.5px solid white',
      '&:hover': {
        color: '#9ABDFF',
      },
    },
    [theme.breakpoints.down(490)]: {
      width: '100%',
      right: 0,
    },
  },
}));

const LandingButtons = () => {
  const classes = useStyles();
  const { login, logout, user } = useAuth();

  return (
    <div className={classes.buttonsContainer}>
      <Link href="/about" passHref>
        <Button
          style={{
            border: 'none',
            padding: 0,
            fontSize: '1.2rem',
          }}
          variant="outlined"
        >
          About us
        </Button>
      </Link>
      {user ? (
        <>
          <Button
            onClick={() => logout()}
            style={{
              border: 'none',
              padding: 0,
              fontSize: '1.2rem',
            }}
            variant="outlined"
          >
            Sign out
          </Button>
          <TelescopeAvatar name={user.name} img={user.avatarUrl} size="40px" />
        </>
      ) : (
        <>
          <Button
            style={{
              border: 'none',
              padding: 0,
              fontSize: '1.2rem',
            }}
            onClick={() => login()}
            variant="outlined"
          >
            Sign in
          </Button>
          <Button
            style={{
              fontSize: '1.3rem',
            }}
            variant="outlined"
          >
            Sign up
          </Button>
        </>
      )}
    </div>
  );
};

export default LandingButtons;
