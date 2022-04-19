import { createStyles } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import CopyButton from './CopyButton';

type Props = {
  url: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    copyButton: {
      color: theme.palette.primary.main,
      fontSize: '1.25rem',
      display: 'inline',
    },
  })
);

const ShareButton = ({ url }: Props) => {
  const classes = useStyles();

  return (
    <CopyButton
      className={classes.copyButton}
      onClick={() => {
        navigator.clipboard.writeText(url);
      }}
      beforeCopyMessage="Copy URL"
    />
  );
};

export default ShareButton;
