import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Link from 'next/link';
import Login from './Login';

const useStyles = makeStyles((theme) => ({
  buttonsContainer: {
    // backgroundColor: 'green',
    position: 'absolute',
    color: 'white',
    top: '20px',
    width: '230px',
    right: '5%',
    display: 'flex',
    justifyContent: 'space-around',
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

const LandingButtons = () => {
  const classes = useStyles();

  return (
    <div className={classes.buttonsContainer}>
      <Link href="/about" passHref>
        <Button
          style={{
            border: 'none',
            padding: 0,
          }}
          variant="outlined"
        >
          About us
        </Button>
      </Link>
      <Button
        style={{
          border: 'none',
          padding: 0,
        }}
        variant="outlined"
      >
        Sign in
      </Button>
      <Button variant="outlined">Sign up</Button>
    </div>
  );
};

export default LandingButtons;
