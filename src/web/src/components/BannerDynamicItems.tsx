import NoSsr from '@material-ui/core/NoSsr';

import { Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import DynamicImage from './DynamicImage';
import { imageServiceUrl } from '../config';

const useStyles = makeStyles((theme: Theme) => ({
  dynamic: {
    height: '100vh',
    transition: 'opacity 1s ease-in-out',
    backgroundColor: theme.palette.primary.main,
    opacity: 0.9,
    backgroundSize: 'cover',
    backgroundPosition: '50% 0',
    backgroundImage:
      'linear-gradient(to right bottom, #51f2e4, #00cbea, #00a0ee, #0071e0, #0c39b7);',
    [theme.breakpoints.down('md')]: {
      height: 'calc(100vh - 64px)',
    },
    [theme.breakpoints.down('sm')]: {
      height: 'calc(100vh - 56px)',
    },
  },
}));

// the placeholder and the main image must refer to the same source
// we use this to request a consistent image vs a random one
const index = Math.floor(Math.random() * 999);

type BannerImageProps = {
  visible?: boolean;
};

const BannerDynamicItems = ({ visible = true }: BannerImageProps) => {
  const classes = useStyles();

  const imageURL = `${imageServiceUrl}/${index}/`;
  const placeholderURL = `${imageURL}?w=40`;

  return (
    <div className={classes.dynamic}>
      {/** prevent server-side rendering of the random banner images, which won't match with the client */}
      <NoSsr>
        <DynamicImage imageURL={imageURL} placeholderURL={placeholderURL} visible={visible} />
      </NoSsr>
    </div>
  );
};

export default BannerDynamicItems;
