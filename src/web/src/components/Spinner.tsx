import { makeStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

const Spinner = () => {
  const classes = useStyles();

  return (
    <div className={classes.root} data-testid="spinner-wrapper">
      <CircularProgress data-testid="circular-process" />
    </div>
  );
};

export default Spinner;
