import { useState } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';

import { imageServiceUrl } from '../config';

const useStyles = makeStyles(() => ({
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
    transition: 'opacity 1s ease',
  },
  loadingImg: {
    opacity: 0,
  },
  loadedImg: {
    opacity: 1,
  },
  placeholderImg: {
    filter: 'blur(15px)',
  },
  mainImg: {
    zIndex: 99,
  },
  backdrop: {
    zIndex: 100,
    display: 'block',
    height: '100%',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    boxSizing: 'border-box',
    margin: 0,
    backgroundColor: '#000000',
    opacity: '.70',
  },
}));

type DynamicImageProps = {
  imageURL?: string;
  placeholderURL?: string;
  visible?: boolean;
};

// Define a series of sizes, and let the browser figure out which one to use
function createSrcset(imageSrc: string) {
  const sizes = [200, 375, 450, 640, 750, 828, 1080, 1250, 1500, 1920, 2000];

  return sizes.map((size) => `${imageSrc}?w=${size} ${size}w`).join(', ');
}

const DynamicImage = ({ imageURL, placeholderURL, visible = true }: DynamicImageProps) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);

  const imageSrc = imageURL ?? imageServiceUrl!;
  const srcset = createSrcset(imageSrc);

  const onBannerImageLoaded = () => {
    setLoading(false);
  };

  return (
    <picture>
      {placeholderURL && (
        <img
          className={clsx(classes.img, classes.placeholderImg)}
          src={placeholderURL}
          alt="Telescope banner placeholder"
          decoding="async"
          sizes="100vw"
        />
      )}
      <img
        src={imageURL}
        className={clsx(
          classes.img,
          classes.mainImg,
          loading || !visible ? classes.loadingImg : classes.loadedImg
        )}
        alt="Telescope banner"
        loading="eager"
        decoding="async"
        // Let the browser know that we want to fill the whole viewport width with this image
        sizes="100vw"
        srcSet={srcset}
        onLoad={onBannerImageLoaded}
      />
      <div className={classes.backdrop} />
    </picture>
  );
};

export default DynamicImage;
