import { useState, MouseEvent, AllHTMLAttributes } from 'react';
import { Tooltip, IconButton, createStyles, Zoom } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';
import Check from '@material-ui/icons/Check';

const useStyles = makeStyles(() =>
  createStyles({
    copy: {
      fontSize: 'inherit',
    },
    check: {
      fill: '#3fb950',
      fontSize: 'inherit',
    },
    iconBtn: {
      padding: '5px',
      color: 'inherit',
      fontSize: 'inherit',
    },
  })
);

const ButtonTooltip = withStyles({
  tooltip: {
    fontSize: 'inherit',
    margin: 0,
  },
})(Tooltip);

type CopyButtonProps = {
  onClick: (e: MouseEvent) => void;
  beforeCopyMessage: string;
  afterCopyMessage?: string;
};

const CopyButton = ({
  onClick,
  beforeCopyMessage,
  afterCopyMessage,
  ...allOtherProps
}: CopyButtonProps & AllHTMLAttributes<HTMLDivElement>) => {
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
    <div {...allOtherProps}>
      {!copied ? (
        <ButtonTooltip title={beforeCopyMessage} arrow placement="top" TransitionComponent={Zoom}>
          <IconButton className={classes.iconBtn} onClick={handleClick}>
            <CopyIcon className={classes.copy} />
          </IconButton>
        </ButtonTooltip>
      ) : (
        <ButtonTooltip
          title={afterCopyMessage || 'Copied!'}
          arrow
          placement="top"
          TransitionComponent={Zoom}
        >
          <IconButton className={classes.iconBtn}>
            <Check className={classes.check} />
          </IconButton>
        </ButtonTooltip>
      )}
    </div>
  );
};

export default CopyButton;
