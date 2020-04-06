import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Container,
  Dialog,
  DialogContent,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Popover,
  Typography,
} from '@material-ui/core';
import { AccountCircle, AddCircle, Delete, HelpOutline, RssFeed } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
// eslint-disable-next-line import/no-extraneous-dependencies
import { isWebUri } from 'valid-url';

import PageBase from './PageBase';
import useSiteMetadata from '../hooks/use-site-metadata';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(2),
  },
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

function DeleteDialogButton({ feed }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const removeFeed = () => {
    console.log(`Removing feed hosted at URL ${feed.url}`);
    // TODO
    window.location.reload(false);
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

DeleteDialogButton.propTypes = {
  feed: PropTypes.object,
};

export default function MyFeeds() {
  const classes = useStyles();
  const [newFeedAuthor, setNewFeedAuthor] = useState('');
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [submitStatus, setSubmitStatus] = useState({ message: '', isError: false });
  const [userInfo, setUserInfo] = useState({});
  const [feedHash, updateFeedHash] = useState({}); // { id1: {author: '...', url: '...'} }, ... ]

  const { telescopeUrl } = useSiteMetadata();

  const newFeedAuthorRef = React.createRef();
  const newFeedUrlRef = React.createRef();

  async function hashUserFeeds() {
    const [user, feedItems] = await Promise.all([
      fetch(`${telescopeUrl}/user/info`).then((res) => res.json()),
      fetch(`${telescopeUrl}/feeds`).then((res) => res.json()),
    ]);
    const allFeeds = await Promise.all(
      feedItems.map((item) => fetch(`${telescopeUrl}${item.url}`))
    ).then((responses) => Promise.all(responses.map((res) => res.json())));

    if (allFeeds.length && user) {
      const userFeeds = allFeeds.filter((feed) => {
        return feed.user === user.id;
      });

      const userFeedHash = userFeeds.reduce((hash, feed) => {
        hash[feed.id] = { author: feed.author, url: feed.url };
        return hash;
      }, {});

      return Promise.all([updateFeedHash(userFeedHash), setUserInfo(user)]);
    }
    return Promise.reject();
  }

  useEffect(() => {
    hashUserFeeds();
    ValidatorForm.addValidationRule('isUrl', (value) => !!isWebUri(value));
    return ValidatorForm.removeValidationRule.bind('isUrl');
  }, []);

  async function addFeed() {
    setSubmitStatus({ message: 'Adding new feed, please wait...' });
    try {
      const response = await fetch(`${telescopeUrl}/feeds`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: userInfo.id,
          author: newFeedAuthor,
          url: newFeedUrl,
        }),
      });
      await setSubmitStatus(
        response.ok
          ? { message: 'Feed added successfully' }
          : { message: `Error: ${response.status} ${response.statusText}`, isError: true }
      );
      if (response.ok) {
        window.location.reload(false);
      }
    } catch (error) {
      setSubmitStatus({ message: error.message, isError: true });
      console.log({ error });
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === 'author') {
      setNewFeedAuthor(value);
    } else {
      setNewFeedUrl(value);
    }
  }

  function handleBlur(event, ref) {
    ref.current.validate(event.target.value, true);
  }

  function listExistingFeeds() {
    if (Object.keys(feedHash).length) {
      return Object.keys(feedHash).map((id) => (
        <Grid container spacing={5} key={id}>
          <Grid item>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item>
                <AccountCircle />
              </Grid>
              <Grid item>
                <TextValidator
                  disabled
                  label="Blog feed author"
                  name="author"
                  value={feedHash[id].author}
                  type="string"
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Grid container spacing={1} alignItems="flex-end">
              <Grid item>
                <RssFeed />
              </Grid>
              <Grid item>
                <TextValidator
                  disabled
                  label="Blog feed URL"
                  name="url"
                  value={feedHash[id].url}
                  type="url"
                />
              </Grid>
              <Grid item>
                <DeleteDialogButton feed={feedHash[id]} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ));
    }
    console.log(`No feeds associated with user ${userInfo.id} found.`);
    return (
      <Typography align="center">
        <em>(It looks like you have not added any blog feeds yet.)</em>
      </Typography>
    );
  }

  return (
    <PageBase title="My Feeds">
      <div className={classes.margin}>
        <ValidatorForm onSubmit={addFeed}>
          <Container maxWidth="xs" bgcolor="aliceblue">
            <Card>
              <Box px={2} py={1}>
                <Typography variant="h3" component="h3" align="center">
                  My Feeds
                </Typography>
                {listExistingFeeds()}
                <Grid container spacing={5}>
                  <Grid item>
                    <Grid container spacing={1} alignItems="flex-end">
                      <Grid item>
                        <AccountCircle />
                      </Grid>
                      <Grid item>
                        <TextValidator
                          disabled={!userInfo.isAdmin}
                          label="Blog feed author"
                          name="author"
                          ref={newFeedAuthorRef}
                          value={newFeedAuthor}
                          onBlur={(event) => handleBlur(event, newFeedAuthorRef)}
                          onChange={handleChange}
                          type="string"
                          validators={['required', 'trim']}
                          errorMessages={"Please enter the blog's author."}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container spacing={1} alignItems="flex-end">
                      <Grid item>
                        <RssFeed />
                      </Grid>
                      <Grid item>
                        <TextValidator
                          label="Blog feed URL"
                          name="url"
                          ref={newFeedUrlRef}
                          value={newFeedUrl}
                          onBlur={(event) => handleBlur(event, newFeedUrlRef)}
                          onChange={handleChange}
                          type="url"
                          validators={['required', 'isUrl']}
                          errorMessages={"Please enter the blog's feed URL."}
                        />
                      </Grid>
                      <Grid item>
                        <HelpPopoverButton />
                      </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                      <Grid item>
                        <IconButton classes={{ root: classes.button }} type="submit">
                          <AddCircle color="secondary" />
                        </IconButton>
                        <Typography color={submitStatus.isError ? 'error' : 'textPrimary'}>
                          {submitStatus.message}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Container>
        </ValidatorForm>
      </div>
    </PageBase>
  );
}
