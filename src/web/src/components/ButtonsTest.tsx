import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  buttonsContainer: {
    position: 'absolute',
    color: 'white',
    top: '20px',
    width: '90%',
    display: 'flex',
    justifyContent: 'flex-end',
    '& > .MuiButton-root': {
      color: 'white',
      border: '1.5px solid white',
      '&:hover': {
        color: '#9ABDFF',
        // backgroundColor: 'rgb(154 189 255)',
      },
    },
  },
}));

const ButtonsTest = () => {
  const classes = useStyles();

  return (
    <div className={classes.buttonsContainer}>
      <Button className={classes.buttons} variant="outlined">
        About us
      </Button>
      <Button className={classes.buttons} variant="outlined">
        Sign in
      </Button>
      <Button className={classes.signupButton} variant="outlined">
        Sign up
      </Button>
    </div>
  );
};

export default ButtonsTest;
