import { Fab, useScrollTrigger, Zoom } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import ScrollAction from './ScrollAction';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1100,
  },
  arrowUpIcon: {
    color: theme.palette.text.primary,
  },
}));

type BackToTopButtonProps = {
  scrollThreshold?: number;
};

const BackToTopButton = ({ scrollThreshold = 1000 }: BackToTopButtonProps) => {
  const classes = useStyles();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: scrollThreshold,
  });
  return (
    <Zoom in={trigger}>
      <div className={classes.root}>
        <ScrollAction>
          <Fab color="secondary" aria-label="scroll back to top">
            <KeyboardArrowUpIcon className={classes.arrowUpIcon} fontSize="large" />
          </Fab>
        </ScrollAction>
      </div>
    </Zoom>
  );
};

export default BackToTopButton;
