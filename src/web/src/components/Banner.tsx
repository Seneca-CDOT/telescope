import { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles, Fab, Grid, Typography } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import { telescopeUrl } from '../config';
import BannerDynamicItems from './BannerDynamicItems';
import ScrollAction from './ScrollAction';
import ButtonsTest from './ButtonsTest';

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
      // backgroundColor: 'yellow',
      top: '45%',
      // marginLeft: '25%',
    },
    telescopeTitle: {
      // position: 'absolute',
      color: '#A0D1FB',
      fontWeight: 'bold',
      fontSize: '7rem',
      letterSpacing: '.45em',
      display: 'block',
      zIndex: 1000,
      marginBottom: '10px',
      // top: theme.spacing(50),
      // left: theme.spacing(65),
    },
    quoteText: {
      width: '70%',
      color: '#FFFFFF',
      fontSize: '2em',
      display: 'block',
      textAlign: 'center',
      zIndex: 1000,
    },
    version: {
      position: 'absolute',
      opacity: 0.85,
      bottom: theme.spacing(6),
      left: theme.spacing(15),
      fontSize: '1.75rem',
      color: theme.palette.text.primary,
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
      bottom: theme.spacing(10),
      zIndex: 300,
      margin: '0 auto',
      '& .MuiFab-root': {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        display: 'grid',
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
      fontSize: '5rem',
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
        <ButtonsTest />

        <a
          href={`${gitInfo.gitHubUrl}`}
          title={`git commit ${gitInfo.sha}`}
          className={classes.version}
        >
          v {gitInfo.version}
        </a>
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
      <Grid
        container
        spacing={0}
        direction="row"
        alignItems="center"
        justify="center"
        className={classes.container}
      >
        <Grid id="back-to-top-anchor-mobile" item xs={8}>
          <div className={classes.icon}>
            <ScrollAction>
              <Fab color="primary" aria-label="scroll-down">
                <KeyboardArrowDownIcon className={classes.arrowDownIcon} />
              </Fab>
            </ScrollAction>
          </div>
        </Grid>
      </Grid>
      <div className={classes.anchor} id="back-to-top-anchor" />
    </>
  );
}
