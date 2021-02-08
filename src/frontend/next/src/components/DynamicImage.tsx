import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  background: {
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'scroll',
    backgroundSize: 'cover',
    transition: 'opacity 1s ease-in-out',
    height: 'calc(100vh - 64px)',
    [theme.breakpoints.between('xs', 'sm')]: {
      height: 'calc(100vh - 56px)',
    },
    width: '100%',
    opacity: '.45',
    top: 0,
  },
}));

const DynamicImage = () => {
  const classes = useStyles();

  return (
    <picture className={classes.background}>
      <img src="/background.jpg" loading="lazy" alt="" />
    </picture>
  );
};

export default DynamicImage;
