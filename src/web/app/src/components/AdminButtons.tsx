import { makeStyles, Theme } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import FlagIcon from '@material-ui/icons/Flag';
import DeleteIcon from '@material-ui/icons/Delete';
import useAuth from '../hooks/use-auth';

const useStyles = makeStyles((theme: Theme) => ({
  adminButtons: {
    float: 'right',
    [theme.breakpoints.down(1200)]: {
      height: '20px',
      margin: '-1em .5em 0 0',
    },
    [theme.breakpoints.down(1024)]: {
      marginTop: '-2.1em',
    },
  },
  iconSpan: {
    paddingLeft: '10px',
    paddingRight: '10px',
    [theme.breakpoints.down(1200)]: {
      paddingRight: '0px',
      paddingLeft: '0px',
    },
  },
  icon: {
    color: theme.palette.primary.main,
    [theme.breakpoints.down(1200)]: {
      transform: 'scale(0.7)',
    },
    '&:hover': {
      color: theme.palette.primary.light,
    },
  },
}));

function AdminButtons() {
  const classes = useStyles();
  const { user } = useAuth();
  if (!user?.isAdmin) {
    return null;
  }

  return (
    <span className={classes.adminButtons}>
      <span className={classes.iconSpan}>
        <IconButton size="small">
          <FlagIcon className={classes.icon} fontSize="large" />
        </IconButton>
      </span>
      <span className={classes.iconSpan}>
        <IconButton size="small">
          <DeleteIcon className={classes.icon} fontSize="large" />
        </IconButton>
      </span>
    </span>
  );
}

export default AdminButtons;
