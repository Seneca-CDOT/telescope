import { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles, Fab, Grid, Typography } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import useSiteMetadata from '../hooks/use-site-metadata';
import BannerDynamicItems from './BannerDynamicItems';
import ScrollAction from './ScrollAction';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    h1: {
      position: 'absolute',
      color: theme.palette.primary.contrastText,
      fontFamily: 'Roboto',
      fontWeight: 'bold',
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
    heroBanner: {
      height: '100vh',
      overflow: 'hidden',
    },
    version: {
      position: 'absolute',
      fontFamily: 'Roboto',
      opacity: 0.85,
      bottom: theme.spacing(6),
      left: theme.spacing(8),
      fontSize: '1.75rem',
      color: theme.palette.primary.contrastText,
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
      bottom: theme.spacing(20),
      zIndex: 300,
      margin: '0 auto',
      [theme.breakpoints.between('xs', 'sm')]: {
        left: '55%',
        bottom: theme.spacing(18),
      },
    },
    anchor: {
      position: 'relative',
      top: '1rem',
    },
    container: {
      backgroundColor: '#E5E5E5',
    },
  })
);

export default function Banner() {
  const classes = useStyles();
  const { telescopeUrl } = useSiteMetadata();
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

        <Typography variant="h1" className={classes.h1}>
          Telescope
        </Typography>

        <a
          href={`${gitInfo.gitHubUrl}`}
          title={`git commit ${gitInfo.sha}`}
          className={classes.version}
        >
          v {gitInfo.version}
        </a>
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
              <Fab color="secondary" aria-label="scroll-down">
                <KeyboardArrowDownIcon fontSize="large" />
              </Fab>
            </ScrollAction>
          </div>
        </Grid>
      </Grid>
      <div className={classes.anchor} id="back-to-top-anchor" />
    </>
  );
}
