import { useState, CSSProperties, MouseEvent } from 'react';
import { createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { Transition } from 'react-transition-group';
import clsx from 'clsx';

const useStyles = makeStyles(() =>
  createStyles({
    copyButton: {
      position: 'absolute',
      right: 0,
      padding: '1rem',
      marginRight: '1.5rem',
      transitionDuration: '0.2s',
      transitionTimingFunction: 'ease',
      cursor: 'pointer',
      animation: 'fade-in-out 200ms both',
    },
    icon: {
      fontSize: '2rem',
    },
    copyBadge: {
      position: 'absolute',
      top: '50%',
      right: 0,
      transitionProperty: 'transform, opacity',
      transitionDuration: '0.2s',
      transitionTimingFunction: 'ease',
      borderRadius: '5px',
      padding: '3px',
    },
  })
);

type CopyButtonProps = {
  onClick: (e: MouseEvent) => void;
};

const transition: { [state: string]: CSSProperties } = {
  entered: { transform: 'translate(-70%, -50%)', opacity: 1 },
  entering: { transform: 'translate(0, -50%)', opacity: 0 },
  exited: { transform: `translate(0, -50%)`, opacity: 0 },
  exiting: { transform: `translate(0, -50%)`, opacity: 0 },
};

const CopyButton = ({ onClick }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);
  const classes = useStyles();

  const handleClick = (e: MouseEvent) => {
    onClick(e);

    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };
  return (
    <Button
      aria-label="copy"
      onClick={handleClick}
      className={clsx('copyCodeBtn', classes.copyButton)}
      color="inherit"
      size="small"
    >
      <FileCopyIcon className={classes.icon} />
      <Transition in={copied} timeout={300} unmountOnExit>
        {(state) => (
          <Paper elevation={5} style={{ ...transition[state] }} className={classes.copyBadge}>
            Copied ✓
          </Paper>
        )}
      </Transition>
    </Button>
  );
};

export default CopyButton;
