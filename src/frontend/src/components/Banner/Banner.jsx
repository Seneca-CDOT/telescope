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
        <div className="bannerImg"></div>
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
