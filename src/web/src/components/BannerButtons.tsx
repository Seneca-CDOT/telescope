import Link from 'next/link';
import { useRouter } from 'next/router';
import { makeStyles, Tooltip, withStyles, Zoom } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import useAuth from '../hooks/use-auth';
import TelescopeAvatar from './TelescopeAvatar';
import PopUp from './PopUp';

const useStyles = makeStyles((theme) => ({
  buttonsContainer: {
    position: 'absolute',
    color: 'white',
    top: '20px',
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
  },
  userSignedInClass: {
    width: '155px',
    [theme.breakpoints.down(490)]: {
      width: '100%',
      right: 0,
    },
  },
  userNotSignedClass: {
    width: '250px',
    [theme.breakpoints.down(490)]: {
      width: '100%',
      right: 0,
    },
  },
}));

const ButtonTooltip = withStyles({
  tooltip: {
    fontSize: '1.5rem',
    margin: 0,
  },
})(Tooltip);

const BannerButtons = () => {
  const { login, logout, user } = useAuth();

  const classes = useStyles();

  const router = useRouter();

  return (
    <div
      className={`${classes.buttonsContainer} ${
        user?.isRegistered ? classes.userSignedInClass : classes.userNotSignedClass
      }`}
      // style={user?.isRegistered ? { width: '155px' } : { width: '250px' }}
    >
      {user && !user?.isRegistered && (
        <PopUp
          messageTitle="Telescope"
          message={`Hello ${user?.name}, to sign in you need to create your Telescope account. Click SIGN UP to start.`}
          agreeAction={() => router.push('/signup')}
          agreeButtonText="SIGN UP"
          disagreeAction={() => logout()}
          disagreeButtonText="CANCEL"
        />
      )}
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
      {user?.isRegistered ? (
        <>
          <ButtonTooltip title="Sign out" arrow placement="top" TransitionComponent={Zoom}>
            <div>
              <TelescopeAvatar
                action={() => logout()}
                name={user.name}
                img={user.avatarUrl}
                size="40px"
              />
            </div>
          </ButtonTooltip>
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
          <Link href="/signup" passHref>
            <Button
              style={{
                fontSize: '1.3rem',
              }}
              variant="outlined"
            >
              Sign up
            </Button>
          </Link>
        </>
      )}
    </div>
  );
};

export default BannerButtons;
