import { IconButton, createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

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
    <IconButton onClick={() => setExpandHeader(!expandHeader)} className={classes.iconBtn}>
      {expandHeader ? (
        <ExpandLessIcon className={classes.smallIcon} />
      ) : (
        <ExpandMoreIcon className={classes.smallIcon} />
      )}
    </IconButton>
  ) : (
    <div className={classes.container}>
      <IconButton onClick={() => setExpandHeader(!expandHeader)} className={classes.iconBtn}>
        <ExpandLessIcon className={classes.bigIcon} />
      </IconButton>
    </div>
  );
};
export default ExpandIcon;
