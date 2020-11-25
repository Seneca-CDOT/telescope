import React from 'react';
import PropTypes from 'prop-types';
import { Fab, useScrollTrigger, Zoom } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import ScrollAction from '../ScrollAction';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1100,
  },
}));

const BackToTopButton = ({ window, scrollThreshold = 1000 }) => {
  const classes = useStyles();
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: scrollThreshold,
  });
  return (
    <>
      <Zoom in={trigger}>
        <div className={classes.root}>
          <ScrollAction>
            <Fab color="secondary" aria-label="scroll back to top">
              <KeyboardArrowUpIcon fontSize="large" color="textPrimary" />
            </Fab>
          </ScrollAction>
        </div>
      </Zoom>
    </>
  );
};

BackToTopButton.propTypes = {
  window: PropTypes.func,
  scrollThreshold: PropTypes.number,
};

export default BackToTopButton;
