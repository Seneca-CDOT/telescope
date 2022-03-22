import { createStyles, makeStyles, Theme } from '@material-ui/core';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0',
      margin: '0',
      width: '100%',
      position: 'relative',
      minHeight: '75%',
      [theme.breakpoints.down(600)]: {
        minHeight: '70%',
      },
    },
    container: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      justifyItems: 'center',
      textAlign: 'center',
      alignItems: 'center',
      width: '100%',
      position: 'absolute',
      minHeight: '100%',
      [theme.breakpoints.down(600)]: {
        width: '90%',
        marginLeft: '5%',
      },
    },
    welcomeMessage: {
      fontSize: '0.8em',
    },
    telescopeInfo: {
      fontSize: '0.8em',
      lineHeight: '2.5em',
    },
    helpText: {
      fontSize: '0.8em',
      lineHeight: '2.5em',
    },
    helpButtons: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
    button: {
      padding: '0 0.5em',
      background: '#121D59',
      color: '#A0D1FB',
      fontSize: '0.9em',
      margin: '0 0.5em 0em 1em',
      '&:hover': {
        color: 'black',
        borderColor: '#121D59',
      },
      height: '30px',
    },
    text: {
      fontSize: '1.04em',
      alignSelf: 'end',
      lineHeight: '2.5em',
    },
  })
);

const Overview = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.welcomeMessage}>
          <h1>Welcome</h1>
        </div>
        <div className={classes.telescopeInfo}>
          <h2>
            Telescope requires a number of pieces of user information, for example your Seneca
            email, a GitHub account, a Blog, and a user display name. In the following steps we will
            gather this information and create your account.
          </h2>
        </div>
        <div className={classes.helpText}>
          <h2>If you need help to create a GitHub account and a blog page please check:</h2>
        </div>
        <div className={classes.helpButtons}>
          <Button variant="outlined" className={classes.button}>
            Create a blog
          </Button>
          <Button variant="outlined" className={classes.button}>
            Create a GitHub
          </Button>
        </div>
        <div className={classes.text}>
          <h3>
            After creating a blog and a GitHub account you need to login with your Seneca email.
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Overview;
