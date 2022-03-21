import { Theme } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme: Theme) => ({
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
