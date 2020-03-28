import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import CssBaseline from '@material-ui/core/CssBaseline';

import useSiteMetadata from '../../hooks/use-site-metadata';

import Version from '../../../../../package.json';
import './Banner.css';

const useStyles = makeStyles(theme => ({
  h1: {
    position: 'absolute',
    color: 'white',
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    opacity: 0.85,
    fontSize: '12rem',
    [theme.breakpoints.between('xs', 'sm')]: {
      fontSize: '4rem',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: '8rem',
    },
    [theme.breakpoints.up('xl')]: {
      fontSize: '12rem',
    },
    display: 'block',
    top: theme.spacing(20),
    left: theme.spacing(8),
    transition: 'linear 250ms all',
  },
  stats: {
    position: 'absolute',
    color: 'white',
    fontFamily: 'Roboto',
    opacity: 0.85,
    fontSize: '2rem',
    [theme.breakpoints.between('xs', 'sm')]: {
      fontSize: '2rem',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: '4rem',
    },
    [theme.breakpoints.up('xl')]: {
      fontSize: '8rem',
    },
    width: '75%',
    display: 'block',
    bottom: theme.spacing(20),
    left: theme.spacing(8),
    transition: 'linear 250ms all',
    lineHeight: 'inherit',
    letterSpacing: 'inherit',
  },

  version: {
    position: 'absolute',
    opacity: 0.85,
    bottom: theme.spacing(10),
    left: theme.spacing(8),
    fontSize: '1.75rem',
    [theme.breakpoints.between('xs', 'sm')]: {
      fontSize: '1.75rem',
    },
    [theme.breakpoints.between('md', 'lg')]: {
      fontSize: '2rem',
    },
    [theme.breakpoints.up('xl')]: {
      fontSize: '4rem',
    },

    color: 'white',
  },
}));

function ScrollDown(props) {
  const { children } = props;

  const handleClick = event => {
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

function RetrieveBackgroundImage() {
  const [backgroundImgSrc, setBackgroundImgSrc] = useState('');
  const [transitionBackground, setTransitionBackground] = useState(true);

  useEffect(() => {
    async function getBackgroundImgSrc() {
      try {
        // Uses https://unsplash.com/collections/894/earth-%26-planets collection
        /* Other Options: 
        - https://unsplash.com/collections/2411320/trend%3A-extreme-neon
        - https://unsplash.com/collections/1538150/milkyway
        - https://unsplash.com/collections/291422/night-lights
        */

        // Ensure we are using an image which fits correctly to user's viewspace
        const dimensions = `${window.innerWidth}x${window.innerHeight}`;
        const response = await fetch(`https://source.unsplash.com/collection/894/${dimensions}/`);

        if (response.status !== 200) {
          throw new Error(response.statusText);
        }

        const src = response.url;

        // Ease in Background
        setBackgroundImgSrc(src);
        setTransitionBackground(false);
      } catch (error) {
        console.error('Error getting user info', error);
        // Fallback to default image
        setBackgroundImgSrc('../../images/hero-banner.png');
      }
    }

    getBackgroundImgSrc();
  }, []);

  return (
    <div
      className="bannerImg"
      style={{
        backgroundImage:
          backgroundImgSrc === '../../images/hero-banner.png'
            ? backgroundImgSrc
            : `url(${backgroundImgSrc})`,
        opacity: transitionBackground ? 0 : 0.4,
      }}
    ></div>
  );
}

function RetrieveStats() {
  const { telescopeUrl } = useSiteMetadata();
  const [stats, setStats] = useState({ stats: { posts: 0, authors: 0, words: 0 } });

  useEffect(() => {
    async function getStats() {
      try {
        const response = await fetch(`${telescopeUrl}/stats/year`);
        if (response.status !== 200) {
          throw new Error(response.statusText);
        }

        const stat = await response.json();
        const localeStats = {
          posts: stat.posts.toLocaleString(),
          authors: stat.authors.toLocaleString(),
          words: stat.words.toLocaleString(),
        };
        setStats(localeStats);
      } catch (error) {
        console.error('Error getting user info', error);
      }
    }

    getStats();
  }, [telescopeUrl]);

  return (
    <div className="stats">
      This year {stats.authors} of us have written {stats.words} words and counting. Add yours!
    </div>
  );
}

ScrollDown.propTypes = {
  children: PropTypes.element.isRequired,

  window: PropTypes.func,
};

export default function Banner() {
  const classes = useStyles();
  return (
    <React.Fragment>
      <CssBaseline />
      <div className="heroBanner">
        <RetrieveBackgroundImage />

        <ThemeProvider>
          <Typography variant="h1" className={classes.h1}>
            {'Telescope'}
          </Typography>

          <Typography variant="caption" className={classes.stats}>
            <RetrieveStats />
          </Typography>
        </ThemeProvider>
        <div className={classes.version}>v {Version.version}</div>

        <div className="icon">
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
