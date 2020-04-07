import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle,
  IconButton,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  button: {
    padding: '3px 0 3px 0',
  },
}));

function DeleteFeedDialogButton({ feed }) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const removeFeed = () => {
    console.log(`Removing feed hosted at URL ${feed.url}`);
    // TODO https://github.com/Seneca-CDOT/telescope/issues/946
  };

  return (
    <div>
      <IconButton classes={{ root: classes.button }} onClick={handleClickOpen}>
        <Delete color="secondary" />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Remove feed hosted at ${feed.url}?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Telescope will no longer display blog posts from this feed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary" variant="outlined" autoFocus>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleClose();
              removeFeed();
            }}
            color="primary"
            variant="contained"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

DeleteFeedDialogButton.propTypes = {
  feed: PropTypes.object,
};

export default DeleteFeedDialogButton;
