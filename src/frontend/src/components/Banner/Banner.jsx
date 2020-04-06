import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import CssBaseline from '@material-ui/core/CssBaseline';
import useSiteMetadata from '../../hooks/use-site-metadata';

const useStyles = makeStyles((theme) => ({
  h1: {
    position: 'absolute',
    color: 'white',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    opacity: 0.85,
    fontSize: '12rem',
    display: 'block',
    top: theme.spacing(20),
    left: theme.spacing(8),
    [theme.breakpoints.between('xs', 'sm')]: {
      fontSize: '4rem',
      textAlign: 'left',
      left: theme.spacing(4),
      right: theme.spacing(4),
      top: theme.spacing(14),
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: '8rem',
    },
    [theme.breakpoints.up('xl')]: {
      fontSize: '12rem',
    },
  },
  bannerImg: {
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'scroll',
    backgroundSize: 'cover',
    height: '100vh',
    opacity: 0.4,
    '-webkit-transition': 'opacity 1s ease-in-out',
    '-moz-transition': 'opacity 1s ease-in-out',
    '-o-transition': 'opacity 1s ease-in-out',
    transition: 'opacity 1s ease-in-out',
  },
  heroBanner: {
    height: '100vh',
  },
  stats: {
    position: 'absolute',
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: '2rem',
    display: 'block',
    bottom: theme.spacing(12),
    left: theme.spacing(8),
    lineHeight: 'inherit',
    letterSpacing: 'inherit',
    transition: 'all linear 1s',
    [theme.breakpoints.between('xs', 'sm')]: {
      textAlign: 'left',
      fontSize: '2rem',
      left: theme.spacing(4),
      right: theme.spacing(4),
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: '4rem',
    },
    [theme.breakpoints.up('xl')]: {
      fontSize: '8rem',
    },
  },

  version: {
    position: 'absolute',
    opacity: 0.85,
    bottom: theme.spacing(6),
    left: theme.spacing(8),
    fontSize: '1.75rem',
    color: 'white',
    [theme.breakpoints.between('xs', 'sm')]: {
      left: theme.spacing(4),
      right: theme.spacing(4),
      fontSize: '1.75rem',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: '2rem',
    },
    [theme.breakpoints.up('xl')]: {
      fontSize: '4rem',
    },
    textDecorationLine: 'none',
    '&:hover': {
      textDecorationLine: 'underline',
    },
  },
  icon: {
    height: '5.6rem',
    width: '5.6rem',
    position: 'relative',
    left: '49.5%',
    bottom: theme.spacing(20),
    [theme.breakpoints.between('xs', 'sm')]: {
      right: theme.spacing(4),
      left: '80%',
      bottom: theme.spacing(18),
    },
  },
}));

function ScrollDown(props) {
  const { children } = props;

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div onClick={handleClick} role="presentation">
      {children}
    </div>
  );
}

async function getDynamicAsset(url, success, failure) {
  try {
    const response = await fetch(url);

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }

    if (response.headers.get('content-type').includes('application/json')) {
      success(await response.json());
      return;
    }

    success(response);
  } catch (error) {
    console.error('Error getting dynamic asset', error);

    if (failure) {
      failure();
    }
  }
}

function RetrieveBannerDynamicAssets() {
  const [backgroundImgSrc, setBackgroundImgSrc] = useState('');
  const [transitionBackground, setTransitionBackground] = useState(true);
  const [stats, setStats] = useState({ stats: { posts: 0, authors: 0, words: 0 } });

  const classes = useStyles();
  const { telescopeUrl } = useSiteMetadata();

  useEffect(() => {
    async function getBackgroundImgSrc() {
      // Uses https://unsplash.com/collections/894/earth-%26-planets collection
      /* Other Options:
        - https://unsplash.com/collections/2411320/trend%3A-extreme-neon
        - https://unsplash.com/collections/1538150/milkyway
        - https://unsplash.com/collections/291422/night-lights
        */

      // Ensure we are using an image which fits correctly to user's viewspace
      const dimensions = `${window.innerWidth}x${window.innerHeight}`;

      await getDynamicAsset(
        `https://source.unsplash.com/collection/894/${dimensions}/`,
        (response) => {
          setBackgroundImgSrc(response.url);
          getStats();
        },
        () => {
          // Fallback to default image
          setBackgroundImgSrc('../../images/hero-banner.png');
        }
      );
    }

    async function getStats() {
      await getDynamicAsset(`${telescopeUrl}/stats/year`, (response) => {
        const localeStats = {
          posts: response.posts.toLocaleString(),
          authors: response.authors.toLocaleString(),
          words: response.words.toLocaleString(),
        };
        setStats(localeStats);

        // Ease in Background
        setTransitionBackground(false);
      });
    }

    getBackgroundImgSrc();
  }, [telescopeUrl]);

  return (
    <div>
      <div
        className={classes.bannerImg}
        style={{
          backgroundImage:
            backgroundImgSrc === '../../images/hero-banner.png'
              ? backgroundImgSrc
              : `url(${backgroundImgSrc})`,
          opacity: transitionBackground ? 0 : 0.4,
        }}
      ></div>
      <Typography
        variant="caption"
        className={classes.stats}
        style={{
          opacity: transitionBackground ? 0 : 0.85,
        }}
      >
        This year {stats.authors} of us have written {stats.words} words and counting. Add yours!
      </Typography>
    </div>
  );
}

ScrollDown.propTypes = {
  children: PropTypes.element.isRequired,

  window: PropTypes.func,
};

export default function Banner() {
  const classes = useStyles();
  const { telescopeUrl } = useSiteMetadata();
  const [gitInfo, setGitInfo] = useState('');

  useEffect(() => {
    async function getGitData() {
      try {
        const res = await fetch(`${telescopeUrl}/health`);

        // Fetch failure
        if (!res.ok) {
          throw new Error(res.statusText);
        }

        const data = await res.json();
        setGitInfo(data.info);
      } catch (error) {
        console.error(`Error retrieving site's health info`, error);
      }
    }
    getGitData();
  }, [telescopeUrl]);

  return (
    <React.Fragment>
      <CssBaseline />
      <div className={classes.heroBanner}>
        <RetrieveBannerDynamicAssets />
        <ThemeProvider>
          <Typography variant="h1" className={classes.h1}>
            {'Telescope'}
          </Typography>
        </ThemeProvider>

        <a
          href={`${gitInfo.gitHubUrl}`}
          title={`git commit ${gitInfo.sha}`}
          className={classes.version}
        >
          v {gitInfo.version}
        </a>
        <div className={classes.icon}>
          <ScrollDown>
            <Fab color="primary" aria-label="scroll-down">
              <KeyboardArrowDownIcon fontSize="large" />
            </Fab>
          </ScrollDown>
        </div>
      </div>
    </React.Fragment>
  );
}
