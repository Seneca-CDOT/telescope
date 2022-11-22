import Link from 'next/link';
import { useRouter } from 'next/router';
import { makeStyles, Tooltip, withStyles, Zoom, IconButton, Theme } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import clsx from 'clsx';
import useAuth from '../hooks/use-auth';
import TelescopeAvatar from './TelescopeAvatar';
import PopUp from './PopUp';

const useStyles = makeStyles((theme: Theme) => ({
  buttonsContainer: {
    paddingTop: 'env(safe-area-inset-top, 0)',
    position: 'absolute',
    color: 'white',
    top: '20px',
    right: '5%',
    display: 'flex',
    justifyContent: 'space-around',
  },
  signUpButton: {
    color: 'white',
    fontSize: '1.3rem',
    border: '1.5px solid white',
    '&:hover': {
      color: theme.palette.primary.light,
      borderColor: theme.palette.primary.light,
      backgroundColor: 'transparent',
    },
  },
  buttons: {
    border: 'none',
    color: 'white',
    padding: 0,
    fontSize: '1.2rem',
    '&:hover': {
      color: theme.palette.primary.light,
      backgroundColor: 'transparent',
    },
  },
  userSignedInClass: {
    width: '330px',
    [theme.breakpoints.down(490)]: {
      width: '100%',
      right: 0,
    },
  },
  userNotSignedClass: {
    width: '480px',
    [theme.breakpoints.down(490)]: {
      width: '100%',
      right: 0,
    },
  },
  icon: {
    fontSize: '2.5rem',
  },
}));

const ButtonTooltip = withStyles({
  tooltip: {
    marginTop: '12px',
    fontSize: '1.5rem',
  },
})(Tooltip);

const BannerButtons = () => {
  const { login, logout, user } = useAuth();

  const classes = useStyles();

  const router = useRouter();

  const handleSignIn = () => login();
  const handleSignOut = () => logout();

  return (
    <div
      className={clsx(
        classes.buttonsContainer,
        user?.isRegistered ? classes.userSignedInClass : classes.userNotSignedClass
      )}
    >
      <Link href="/search" passHref>
        <IconButton color="inherit" className={classes.buttons} aria-label="search" component="a">
          <SearchIcon className={classes.icon} />
        </IconButton>
      </Link>
      <Link href="/dependencies" passHref>
        <Button className={classes.buttons} variant="outlined">
          Dependencies
        </Button>
      </Link>
      {user && !user?.isRegistered && (
        <PopUp
          messageTitle="Telescope"
          message={`Hello ${user?.name}, to sign in you need to create your Telescope account. Click SIGN UP to start.`}
          agreeAction={() => router.push('/signup')}
          agreeButtonText="SIGN UP"
          disagreeAction={handleSignOut}
          disagreeButtonText="CANCEL"
        />
      )}
      <Link href="/docs/overview" passHref>
        <Button className={classes.buttons} variant="outlined">
          About us
        </Button>
      </Link>
      {user?.isRegistered ? (
        <>
          <ButtonTooltip title="Sign out" arrow placement="top" TransitionComponent={Zoom}>
            <div>
              <TelescopeAvatar
                action={handleSignOut}
                name={user.name}
                img={user.avatarUrl}
                size="40px"
              />
            </div>
          </ButtonTooltip>
        </>
      ) : (
        <>
          <Button className={classes.buttons} onClick={handleSignIn} variant="outlined">
            Sign in
          </Button>
          <Link href="/signup" passHref>
            <Button className={classes.signUpButton} variant="outlined">
              Sign up
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default BannerButtons;
