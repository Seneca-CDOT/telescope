import React from 'react';
import { Box, IconButton, Popover, Typography } from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';

const useStyles = makeStyles(() => ({
  button: {
    padding: '3px 0 3px 0',
  },
}));

function HelpPopoverButton() {
  const classes = useStyles();

  return (
    <PopupState variant="popover" popupId="help-popover">
      {(popupState) => (
        <div>
          <IconButton
            color="secondary"
            classes={{ root: classes.button }}
            {...bindTrigger(popupState)}
          >
            <HelpOutline />
          </IconButton>
          <Popover
            {...bindPopover(popupState)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box p={2}>
              <Typography align="center">
                Please enter the web address of your blog&apos;s RSS or Atom feed.
              </Typography>
              <Typography align="center">
                <em>
                  (<a href="https://rss.com/blog/find-rss-feed/">Not sure how to find that?</a>)
                </em>
              </Typography>
            </Box>
          </Popover>
        </div>
      )}
    </PopupState>
  );
}

export default HelpPopoverButton;
