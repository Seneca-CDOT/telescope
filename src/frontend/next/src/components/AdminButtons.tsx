import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import FlagIcon from '@material-ui/icons/Flag';
import DeleteIcon from '@material-ui/icons/Delete';
import { useUser } from './UserProvider';

const useStyles = makeStyles(() => ({
  iconDiv: {
    float: 'right',
  },
  iconSpan: {
    paddingLeft: '10px',
    paddingRight: '10px',
  },
}));

function AdminButtons() {
  const classes = useStyles();
  const user = useUser();

  return (
    user.isAdmin && (
      <div className={classes.iconDiv}>
        <span className={classes.iconSpan}>
          <IconButton size="small">
            <FlagIcon fontSize="large" />
          </IconButton>
        </span>
        <span className={classes.iconSpan}>
          <IconButton size="small">
            <DeleteIcon fontSize="large" />
          </IconButton>
        </span>
      </div>
    )
  );
}

export default AdminButtons;
