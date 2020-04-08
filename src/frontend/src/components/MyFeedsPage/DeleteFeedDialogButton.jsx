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
import useSiteMetadata from '../../hooks/use-site-metadata';

const useStyles = makeStyles(() => ({
  button: {
    padding: '3px 0 3px 0',
  },
}));

function DeleteFeedDialogButton({ feed }) {
  const { id, url } = feed;
  const classes = useStyles();
  const { telescopeUrl } = useSiteMetadata();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const removeFeed = async () => {
    console.log(`Removing feed hosted at URL ${url}...`);
    try {
      const response = await fetch(`${telescopeUrl}/feeds/${id}`, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      console.log(`Feed removed successfully`);
    } catch (error) {
      console.log(`Error removing feed with ID ${id}`, error);
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
  // 'feed.id': PropTypes.string,
  // 'feed.url': PropTypes.string,
};

export default DeleteFeedDialogButton;
