import { IconButton } from '@mui/material';
import { createStyles, makeStyles } from '@mui/styles';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type Props = {
  small: Boolean;
  expandHeader: Boolean;
  setExpandHeader: Function;
};

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      display: 'flex',
      justifyContent: 'center',
    },
    smallIcon: {
      padding: 0,
      fill: '#cccccc',
    },
    bigIcon: {
      fontSize: '5rem',
      fill: '#cccccc',
    },
    iconBtn: {
      padding: '5px',
    },
  })
);
const ExpandIcon = ({ small, expandHeader, setExpandHeader }: Props) => {
  const classes = useStyles();
  return small ? (
    <IconButton
      onClick={() => setExpandHeader(!expandHeader)}
      className={classes.iconBtn}
      size="large"
    >
      {expandHeader ? (
        <ExpandLessIcon className={classes.smallIcon} />
      ) : (
        <ExpandMoreIcon className={classes.smallIcon} />
      )}
    </IconButton>
  ) : (
    <div className={classes.container}>
      <IconButton
        onClick={() => setExpandHeader(!expandHeader)}
        className={classes.iconBtn}
        size="large"
      >
        <ExpandLessIcon className={classes.bigIcon} />
      </IconButton>
    </div>
  );
};
export default ExpandIcon;
