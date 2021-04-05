import { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles, Fab, Typography } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { telescopeUrl } from '../config';
import BannerDynamicItems from './BannerDynamicItems';
import ScrollAction from './ScrollAction';
import LandingButtons from './BannerButtons';

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
    telescopeTitle: {
      color: '#A0D1FB',
      fontWeight: 'bold',
      fontSize: 'clamp(2.5rem, 4.2vw, 6em)',
      letterSpacing: '.45em',
      display: 'block',
      zIndex: 1000,
      marginBottom: '10px',
    },
    quoteText: {
      width: '70%',
      color: '#FFFFFF',
      fontSize: 'clamp(.9rem, .95vw, 1.6em)',
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
      top: '1rem',
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

export default function Banner() {
  const classes = useStyles();
  const [gitInfo, setGitInfo] = useState({
    gitHubUrl: '',
    sha: '',
    version: '',
  });

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
    <>
      <div className={classes.heroBanner}>
        <BannerDynamicItems />
        <LandingButtons />
      </div>
      <div className={classes.textsContainer}>
        <Typography variant="h1" className={classes.telescopeTitle}>
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
      <div className={classes.anchor} id="posts-anchor" />
    </>
  );
}
