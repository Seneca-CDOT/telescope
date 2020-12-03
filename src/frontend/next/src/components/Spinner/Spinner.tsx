import { FC } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

const Spinner: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root} data-testid="spinner-wrapper">
      <CircularProgress data-testid="circular-process" />
    </div>
  );
};

export default Spinner;
