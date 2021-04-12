import { useEffect, useState, useRef } from 'react';
import {
  makeStyles,
  Theme,
  createStyles,
  Typography,
  useScrollTrigger,
  Fab,
} from '@material-ui/core';
import smoothscroll from 'smoothscroll-polyfill';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { telescopeUrl } from '../config';
import BannerDynamicItems from './BannerDynamicItems';
import LandingButtons from './BannerButtons';
import ScrollAction from './ScrollAction';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heroBanner: {
      maxHeight: '100vh',
      overflow: 'hidden',
      position: 'relative',
    },
    textsContainer: {
      position: 'absolute',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      top: '40%',
    },
    title: {
      color: '#A0D1FB',
      fontWeight: 'bold',
      fontSize: 'clamp(3.2rem, 3.5vw, 6.5rem)',
      letterSpacing: '.45em',
      display: 'block',
      zIndex: 1000,
      marginBottom: '25px',
    },
    quoteText: {
      width: '70%',
      color: '#FFFFFF',
      fontSize: 'clamp(1.6rem, 1.2vw, 2.5rem)',
      display: 'block',
      textAlign: 'center',
      zIndex: 1000,
    },
    version: {
      position: 'absolute',
      opacity: 0.85,
      bottom: theme.spacing(3),
      left: theme.spacing(3),
      fontSize: '1.3em',
      color: 'white',
      textDecorationLine: 'none',
      '&:hover': {
        textDecorationLine: 'underline',
      },
    },
    icon: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      position: 'absolute',
      bottom: theme.spacing(1),
      zIndex: 300,
      margin: '0 auto',
      '& .MuiFab-root': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        display: 'grid',
      },
      [theme.breakpoints.down(1024)]: {
        marginBottom: '60px',
      },
    },
    anchor: {
      position: 'relative',
    },
    container: {
      bottom: '0',
    },
    arrowDownIcon: {
      color: 'white',
      fontSize: '4em',
    },
  })
);

type BannerProps = {
  onVisibilityChange: (visible: boolean) => void;
};

export default function Banner({ onVisibilityChange }: BannerProps) {
  const classes = useStyles();
  const [gitInfo, setGitInfo] = useState({
    gitHubUrl: '',
    sha: '',
    version: '',
  });

  const timelineAnchor = useRef<HTMLDivElement>(null);
  const bannerAnchor = useRef<HTMLDivElement>(null);
  const toTimelineTrigger = useScrollTrigger({
    threshold: 50,
    disableHysteresis: true,
  });
  const toBannerTrigger = !useScrollTrigger({
    threshold: (timelineAnchor.current?.offsetTop || 0) - 50,
    disableHysteresis: true,
  });

  useEffect(() => {
    if (window) {
      // Apply smooth scroll polyfill on mobile
      smoothscroll.polyfill();
    }
  }, []);

  useEffect(() => {
    if (toTimelineTrigger && timelineAnchor?.current) {
      timelineAnchor.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [toTimelineTrigger]);

  useEffect(() => {
    if (toBannerTrigger && bannerAnchor?.current) {
      bannerAnchor.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [toBannerTrigger]);

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
  }, []);

  // Observer banner
  useEffect(() => {
    const options = {
      root: null,
      threshold: 0.9,
    };

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => onVisibilityChange(entry.isIntersecting)),
      options
    );
    observer.observe(timelineAnchor.current!);

    const timelineAnchorCopy = timelineAnchor.current;

    return () => {
      observer.unobserve(timelineAnchorCopy as HTMLDivElement);
    };
  }, [onVisibilityChange]);

  return (
    <>
      <div className={classes.heroBanner} ref={bannerAnchor}>
        <BannerDynamicItems />
        <LandingButtons />
      </div>
      <div className={classes.textsContainer}>
        <Typography variant="h1" className={classes.title}>
          Telescope
        </Typography>
        <Typography variant="h4" className={classes.quoteText}>
          “I think one of my proudest contributions to date was for Node.js.
          <br /> This is something I never would have imagined contributing to even just a year
          ago.”
        </Typography>
      </div>
      <div className={classes.icon}>
        <a
          href={`${gitInfo.gitHubUrl}`}
          title={`git commit ${gitInfo.sha}`}
          className={classes.version}
        >
          v {gitInfo.version}
        </a>
        <ScrollAction>
          <Fab color="primary" aria-label="scroll-down">
            <KeyboardArrowDownIcon className={classes.arrowDownIcon} />
          </Fab>
        </ScrollAction>
      </div>
      <div className={classes.anchor} id="posts-anchor" ref={timelineAnchor} />
    </>
  );
}
