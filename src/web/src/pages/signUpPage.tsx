import { createStyles, makeStyles, Theme } from '@material-ui/core';
import FirstMessage from '../components/SignUp/WelcomeMessage';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0',
      margin: '0',
      backgroundColor: theme.palette.background.default,
      width: '100%',
    },
  })
);

const SignUpPage = () => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        <FirstMessage />
      </div>
    </>
  );
};

export default SignUpPage;
