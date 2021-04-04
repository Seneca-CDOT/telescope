import { makeStyles } from '@material-ui/core/styles';
import { imageServiceUrl } from '../config';

type DynamicImageProps = {
  filter?: boolean;
  color?: string;
  backgroundMode?: boolean;
};

type StyleProps = {
  customColor: boolean;
  isBackground: boolean;
  display: string;
  backgroundColor: string;
  zIndex: number;
};

const buildStyleProps = (propsToStyle: DynamicImageProps) => {
  const stylesProps: StyleProps = {
    customColor: false,
    isBackground: false,
    display: 'none',
    backgroundColor: '',
    zIndex: -1,
  };
  if (propsToStyle.filter) {
    stylesProps.display = 'block';
  }
  if (propsToStyle.color) {
    stylesProps.backgroundColor = propsToStyle.color;
    stylesProps.customColor = true;
  }
  if (propsToStyle.backgroundMode) stylesProps.isBackground = true;

  return stylesProps;
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
    zIndex: (stylesProps: StyleProps) => {
      if (stylesProps.isBackground) return stylesProps.zIndex;
      return { zIndex: 0 };
    },
  },
  backdrop: {
    display: (stylesProps) => stylesProps.display,
    height: '100%',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    boxSizing: 'border-box',
    margin: 0,
    backgroundColor: (stylesProps) => {
      if (stylesProps.customColor) return stylesProps.backgroundColor;
      return theme.palette.type === 'light' ? '#E5E5E5' : '#000000';
    },
    opacity: '.35',
    zIndex: (stylesProps) => {
      if (stylesProps.isBackground) return stylesProps.zIndex;
      return { zIndex: 0 };
    },
  },
}));

const DynamicImage = (dynamicImageProps: DynamicImageProps) => {
  const stylesProps = buildStyleProps(dynamicImageProps);
  const classes = useStyles(stylesProps);

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
