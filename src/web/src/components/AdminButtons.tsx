import { makeStyles, Theme } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import FlagIcon from '@material-ui/icons/Flag';
import DeleteIcon from '@material-ui/icons/Delete';
import useAuth from '../hooks/use-auth';

const useStyles = makeStyles((theme: Theme) => ({
  adminButtons: {
    float: 'right',
    [theme.breakpoints.down(1200)]: {
      float: 'none',
    },
    [theme.breakpoints.down(1024)]: {
      float: 'none',
    },
  },
  iconSpan: {
    paddingLeft: '10px',
    paddingRight: '10px',
    [theme.breakpoints.down(1200)]: {
      paddingLeft: '15px',
      paddingRight: '0px',
    },
    [theme.breakpoints.down(1024)]: {
      paddingLeft: '8px',
    },
  },
  icon: {
    color: theme.palette.type === 'light' ? '#121d59' : '#e5e5e5',
    [theme.breakpoints.down(1200)]: {
      transform: 'scale(0.7)',
    },
    '&:hover': {
      color: theme.palette.type === 'light' ? '#4f96d8' : '#a0d1fb',
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
