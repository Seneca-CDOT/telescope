import { useState } from 'react';
import { Tooltip, IconButton, createStyles, Zoom } from '@material-ui/core';
import { makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';
import Check from '@material-ui/icons/Check';

type Props = {
  url: string;
};

const ButtonTooltip = withStyles({
  tooltip: {
    fontSize: '1.25rem',
    margin: 0,
  },
})(Tooltip);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    copy: {
      fill: theme.palette.primary.main,
    },

    check: {
      fill: '#3fb950',
    },
  })
);

const ShareButton = ({ url }: Props) => {
  const classes = useStyles();

  const [isCopiedToClipboard, setIsCopiedToClipboard] = useState(false);

  const copyToClipboardEvent = () => {
    navigator.clipboard.writeText(url);
    setIsCopiedToClipboard(true);

    setTimeout(() => {
      setIsCopiedToClipboard(false);
    }, 3000);
  };

  return !isCopiedToClipboard ? (
    <ButtonTooltip title="Copy URL" arrow placement="top" TransitionComponent={Zoom}>
      <IconButton
        onClick={() => {
          copyToClipboardEvent();
        }}
      >
        <CopyIcon className={classes.copy} />
      </IconButton>
    </ButtonTooltip>
  ) : (
    <ButtonTooltip title="Copied" arrow placement="top" TransitionComponent={Zoom}>
      <IconButton>
        <Check className={classes.check} />
      </IconButton>
    </ButtonTooltip>
  );
};

export default ShareButton;
