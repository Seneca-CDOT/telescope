import React, { useState, useRef } from 'react';
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
import useSiteMetadata from '../../hooks/use-site-metadata';

const useStyles = makeStyles(() => ({
  button: {
    padding: '3px 0 3px 0',
  },
}));

function DeleteFeedDialogButton({ feed, deletionCallback }) {
  const { id, url } = feed;
  const classes = useStyles();
  const { telescopeUrl } = useSiteMetadata();
  const [open, setOpen] = useState(false);

  const deleteBtnRef = useRef();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const disableBtn = () => {
    deleteBtnRef.current.setAttribute('disabled', 'disabled');
  };

  const removeFeed = async () => {
    console.log(`Removing feed hosted at URL ${url}...`);
    try {
      const response = await fetch(`${telescopeUrl}/feeds/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      deletionCallback(id);

      console.log(`Feed removed successfully`);
    } catch (error) {
      console.error(`Error removing feed with ID ${id}`, error);
      throw error;
    }
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
        <DialogTitle id="alert-dialog-title">{`Remove feed hosted at ${url}?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Telescope will no longer display blog posts from this feed.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button ref={deleteBtnRef} onClick={handleClose} color="secondary" variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => {
              disableBtn();
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
  deletionCallback: PropTypes.func,
};

export default DeleteFeedDialogButton;
