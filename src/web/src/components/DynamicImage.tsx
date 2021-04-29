import { makeStyles, useTheme } from '@material-ui/core';
import { imageServiceUrl } from '../config';

type DynamicImageProps = {
  filter?: boolean;
  color?: string;
  opacity?: string;
};

type DynamicImageStyles = {
  filter: string;
  color: string;
  opacity: string;
};

const useStyles = makeStyles((theme) => ({
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
  backdrop: {
    display: ({ filter }: DynamicImageStyles) => filter,
    height: '100%',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    boxSizing: 'border-box',
    margin: 0,
    backgroundColor: ({ color }: DynamicImageStyles) => color,
    opacity: ({ opacity }: DynamicImageStyles) => opacity,
  },
}));

const DynamicImage = ({ filter, color, opacity }: DynamicImageProps) => {
  const theme = useTheme();

  const styles: DynamicImageStyles = {
    filter: filter ? 'block' : 'none',
    color: color ? color : theme.palette.background.default,
    opacity: opacity ? opacity : '0',
  };

  const classes = useStyles(styles);

  return (
    <picture>
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
      <div className={classes.backdrop} />
    </picture>
  );
};

export default DynamicImage;
