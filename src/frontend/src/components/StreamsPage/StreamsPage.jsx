import React from 'react';
import ReactPlayer from 'react-player';
import { makeStyles } from '@material-ui/core/styles';
import { Container, Grid } from '@material-ui/core';

import ChannelsDrawer from '../ChannelsDrawer';
import StreamTabPanel from '../StreamTabPanel';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  playerContainer: {
    position: 'relative',
    height: '480px',
  },
  player: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
}));

export default function StreamsPage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container justify="space-between" alignItems="stretch">
        <Grid item xs={2}>
          <ChannelsDrawer />
        </Grid>
        <Grid item xs={7}>
          <Container className={classes.playerContainer} maxWidth="md">
            <ReactPlayer
              className={classes.player}
              url="https://www.youtube.com/watch?v=Izw_WtJb7Uo"
              width="100%"
              height="100%"
            />
          </Container>
        </Grid>
        <Grid item xs={3}>
          <StreamTabPanel />
        </Grid>
      </Grid>
    </div>
  );
}
