import { Fab, useScrollTrigger, Zoom } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

import ScrollAction from './ScrollAction';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'fixed',
      bottom: theme.spacing(10),
      right: theme.spacing(2),
      zIndex: 1100,

      [theme.breakpoints.up(1024)]: {
        bottom: theme.spacing(8),
        right: 'calc((100vw - 955px) / 2)',
      },
    },
    arrowUpIcon: {
      color: theme.palette.text.primary,
      fontSize: '2rem',
    },
    MuiFab: {
      boxShadow: 'none',
      width: '61px',
      height: '61px',
    },
  })
);

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
          <Fab color="secondary" aria-label="scroll back to top" className={classes.MuiFab}>
            <KeyboardArrowUpIcon className={classes.arrowUpIcon} />
          </Fab>
        </ScrollAction>
      </div>
    </Zoom>
  );
};

export default BackToTopButton;
