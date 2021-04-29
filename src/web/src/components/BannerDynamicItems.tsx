import { makeStyles, Theme } from '@material-ui/core/styles';
import DynamicImage from './DynamicImage';

const useStyles = makeStyles((theme: Theme) => ({
  dynamic: {
    height: '100vh',
    transition: 'opacity 1s ease-in-out',
    backgroundColor: theme.palette.primary.main,
    opacity: 0.9,
    [theme.breakpoints.down(1024)]: {
      height: 'calc(100vh - 64px)',
    },
    [theme.breakpoints.down('xs')]: {
      height: 'calc(100vh - 56px)',
    },
  },
}));

const BannerDynamicText = () => {
  const classes = useStyles();

  return (
    <div className={classes.dynamic}>
      <DynamicImage filter color="#000000" />
    </div>
  );
};

export default BannerDynamicText;
