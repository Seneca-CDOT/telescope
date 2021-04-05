import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Link from 'next/link';

const useStyles = makeStyles((theme) => ({
  buttonsContainer: {
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
