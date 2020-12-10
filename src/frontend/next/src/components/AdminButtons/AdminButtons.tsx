import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import FlagIcon from '@material-ui/icons/Flag';
import DeleteIcon from '@material-ui/icons/Delete';
import { UserStateContext } from '../../contexts/User/UserContext';

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
  const user = useContext(UserStateContext);

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
