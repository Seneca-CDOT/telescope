import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import useAuth from '../../hooks/use-auth';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0',
      margin: '0',
      backgroundColor: theme.palette.background.default,
      width: '100%',
      minHeight: '100%',
    },
    container: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      justifyItems: 'center',
      textAlign: 'center',
      color: theme.palette.text.primary,
      width: '100%',
      height: '70vh',
    },
    welcomeMessage: {
      fontSize: '1.3em',
    },
    userInfo: {
      margin: 0,
      padding: 0,
      fontSize: '1.3em',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    },
    userInfoLabel: {
      gridColumnStart: '1',
      gridColumnEnd: '3',
    },
    telescopeInfo: {
      fontSize: '1.3em',
      textAlign: 'center',
    },
    helpButtons: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    },
    button: {
      padding: '0 0.5em',
      background: theme.palette.text.secondary,
      color: theme.palette.secondary.main,
      fontSize: '1em',
      margin: '0 2em 5em 0',
      '&:hover': {
        color: 'black',
      },
    },
    text: {
      fontSize: '1.5em',
    },
  })
);

const Overview = () => {
  const classes = useStyles();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.welcomeMessage}>
          {/* Full Name and E-mail from SSO. */}
          <h1>Hello {user.name}, let’s create your Telescope Account</h1>
        </div>
        <div className={classes.userInfo}>
          <h2 className={classes.userInfoLabel}>Follow the information that we already have:</h2>
          <h2>
            <b>Full Name: </b>
            {user.name}
          </h2>
          <h2>
            <b>Email: </b>
            {user.email}
          </h2>
        </div>
        <div className={classes.telescopeInfo}>
          <h2>Telescope system requires all users to have a GitHub account and a blog page.</h2>
          <h2>If you need help to create these accounts please check:</h2>
        </div>
        <div className={classes.helpButtons}>
          <Button className={classes.button}>How to create a personal blog</Button>
          <Button className={classes.button}>How to create a GitHub Account</Button>
        </div>
        <div className={classes.text}>
          <h3>If you already have a GitHub account and a personal blog page click NEXT.</h3>
        </div>
      </div>
    </div>
  );
};

export default Overview;
