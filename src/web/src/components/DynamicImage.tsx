import { makeStyles } from '@material-ui/core/styles';

import { imageServiceUrl } from '../config';

const useStyles = makeStyles((theme) => ({
  background: {
    display: 'block',
    height: '100%',
    // TODO: this isn't right...
    [theme.breakpoints.down(1024)]: {
      height: 'calc(100vh - 64px)',
    },
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    boxSizing: 'border-box',
    margin: 0,
    opacity: '.50',
  },
  img: {
    visibility: 'inherit',
    position: 'absolute',
    inset: 0,
    boxSizing: 'border-box',
    padding: 0,
    border: 'medium none',
    margin: 'auto',
    display: 'block',
    width: 0,
    height: 0,
    minWidth: '100%',
    maxWidth: '100%',
    minHeight: '100%',
    maxHeight: '100%',
    objectFit: 'cover',
  },
}));

const DynamicImage = () => {
  const classes = useStyles();

  return (
    <picture className={classes.background}>
      <img
        src={imageServiceUrl}
        className={classes.img}
        alt=""
        decoding="async"
        // Let the browser know that we want to fill the whole viewport width with this image
        sizes="100vw"
        // Define a series of sizes, and let the browser figure out which one to use
        srcSet={`${imageServiceUrl}?w=200 200w, ${imageServiceUrl}?w=375 375w, ${imageServiceUrl}?w=450 450w, ${imageServiceUrl}?w=640 640w, ${imageServiceUrl}?w=750 750w, ${imageServiceUrl}?w=828 828w, ${imageServiceUrl}?w=1080 1080w, ${imageServiceUrl}?w=1250 1250w, ${imageServiceUrl}?w=1500 1500w, ${imageServiceUrl}?w=1920 1920w, ${imageServiceUrl}?w=2000 2000w`}
      />
    </picture>
  );
};

export default DynamicImage;
