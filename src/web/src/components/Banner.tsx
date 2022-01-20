import { useEffect, useState, useRef } from 'react';
import { BsInfoCircle } from 'react-icons/bs';
import { makeStyles, Theme, createStyles, Typography, Fab } from '@material-ui/core';
import smoothscroll from 'smoothscroll-polyfill';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { telescopeUrl, statusUrl } from '../config';
import BannerDynamicItems from './BannerDynamicItems';
import BannerButtons from './BannerButtons';
import ScrollAction from './ScrollAction';
import quotes from '../student-quotes';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heroBanner: {
      minHeight: '100vh',
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
      width: '80%',
      color: '#FFFFFF',
      fontSize: 'clamp(1.6rem, 1.2vw, 2.5rem)',
      display: 'block',
      textAlign: 'center',
      zIndex: 1000,
      '& a': {
        color: 'inherit',
        textDecorationLine: 'none',
      },
    },
    version: {
      position: 'absolute',
      opacity: 0.85,
      bottom: theme.spacing(3),
      left: theme.spacing(6.5),
      fontFamily: 'Spartan',
      fontSize: '1.3em',
      color: 'white',
      textDecorationLine: 'none',
      '&:hover': {
        textDecorationLine: 'underline',
      },
    },
    infoIcon: {
      position: 'absolute',
      bottom: theme.spacing(3),
      left: theme.spacing(3),
      color: 'white',
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
    },
    planet: {
      position: 'absolute',
      bottom: theme.spacing(3),
      right: theme.spacing(3),
      color: 'white',
    },
    planetAnchor: {
      opacity: 0.85,
      fontFamily: 'Spartan',
      fontSize: '1.3em',
      color: 'white',
      textDecorationLine: 'none',
      '&:hover': {
        textDecorationLine: 'underline',
      },
    },
    space: {
      position: 'relative',
      height: '0.5rem',
      backgroundColor: theme.palette.background.default,
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
  const [studentQuote, setStudentQuote] = useState(quotes[0]);

  const timelineAnchor = useRef<HTMLDivElement>(null);
  const bannerAnchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window) {
      // Apply smooth scroll polyfill on mobile
      smoothscroll.polyfill();
    }
    setStudentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

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
      threshold: 0,
    };

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => onVisibilityChange(entry.isIntersecting)),
      options
    );
    observer.observe(bannerAnchor.current!);

    const bannerAnchorCopy = bannerAnchor.current;

    return () => {
      observer.unobserve(bannerAnchorCopy as HTMLDivElement);
    };
  }, [onVisibilityChange]);

  return (
    <>
      <div className={classes.heroBanner} ref={bannerAnchor}>
        <BannerDynamicItems />
        <BannerButtons />
      </div>
      <div className={classes.textsContainer}>
        <Typography variant="h1" className={classes.title}>
          Telescope
        </Typography>
        <Typography variant="h2" className={classes.quoteText}>
          <a href={studentQuote.url}>
            &quot;{studentQuote.quote}&quot;
            <br />
            <br />
            {studentQuote.author}
          </a>
        </Typography>
      </div>
      <div className={classes.icon}>
        <a className={classes.infoIcon} href={statusUrl} title="API Status">
          <BsInfoCircle size="15" />
        </a>
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
        <div className={classes.planet}>
          <a
            href={`${telescopeUrl}/planet`}
            title="telescope planet"
            className={classes.planetAnchor}
          >
            Planet
          </a>
        </div>
      </div>
      <div className={classes.space} />
      <div className={classes.anchor} id="posts-anchor" ref={timelineAnchor} />
    </>
  );
}
