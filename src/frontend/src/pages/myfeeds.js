import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Card, Container, Grid, IconButton, Typography } from '@material-ui/core';
import { AccountCircle, AddCircle, RssFeed } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { isWebUri } from 'valid-url';

import PageBase from './PageBase';
import useSiteMetadata from '../hooks/use-site-metadata';
import ExistingFeedList from '../components/MyFeedsPage/ExistingFeedList.jsx';
import HelpPopoverButton from '../components/MyFeedsPage/HelpPopoverButton.jsx';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(2),
  },
  button: {
    padding: '3px 0 3px 0',
  },
}));

export default function MyFeeds() {
  const classes = useStyles();
  const [newFeedAuthor, setNewFeedAuthor] = useState('');
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [submitStatus, setSubmitStatus] = useState({ message: '', isError: false });
  const [userInfo, setUserInfo] = useState({});
  const [feedHash, updateFeedHash] = useState({});
  const [numFeeds, setNumFeeds] = useState(0);

  const { telescopeUrl } = useSiteMetadata();

  const newFeedAuthorRef = useRef();
  const newFeedUrlRef = useRef();

  useEffect(() => {
    (async function fetchUserInfo() {
      try {
        const response = await fetch(`${telescopeUrl}/user/info`);

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const user = await response.json();
        setUserInfo(user);
        setNewFeedAuthor(user.name);
      } catch (error) {
        console.log('Failed to fetch user information', error);
        window.location.href = `${telescopeUrl}/404`;
      }
    })();

    ValidatorForm.addValidationRule('isUrl', (value) => !!isWebUri(value));
    return ValidatorForm.removeValidationRule.bind('isUrl');
  }, [telescopeUrl]);

  const getUserFeeds = useCallback(async () => {
    try {
      const response = await fetch(`${telescopeUrl}/user/feeds`);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      return await response.json();
    } catch (error) {
      console.log('Failed to fetch /user/feeds', error);
    }
    // TODO remove the following try/catch block once GET /user/feeds is implemented
    try {
      console.log('Attempting to fetch user feeds via /feeds endpoint');
      const response = await fetch(`${telescopeUrl}/feeds`);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const feedItems = await response.json();

      const allFeedsData = await Promise.all(
        feedItems.map((item) => fetch(`${telescopeUrl}${item.url}`))
      );
      const allFeeds = await Promise.all(allFeedsData.map((res) => res.json()));

      return allFeeds.filter((feed) => feed.user === userInfo.id);
    } catch (error) {
      console.log('Failed to fetch user feeds via /feeds endpoint', error);
      throw error;
    }
  }, [telescopeUrl, userInfo]);

  useEffect(() => {
    console.log('feedHash updated, setting numFeeds to', Object.keys(feedHash).length);
    setNumFeeds(Object.keys(feedHash).length);
  }, [feedHash]);

  useEffect(() => {
    if (userInfo.id) {
      return;
    }

    (async function hashUserFeeds() {
      try {
        const userFeeds = await getUserFeeds();

        const userFeedHash = userFeeds.reduce((hash, feed) => {
          hash[feed.id] = { author: feed.author, url: feed.url };
          return hash;
        }, {});

        updateFeedHash(userFeedHash);
      } catch (error) {
        console.log('Error hashing user feeds', error);
        throw error;
      }
    })();
  }, [telescopeUrl, userInfo, submitStatus, getUserFeeds, feedHash]);

  async function addFeed() {
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
      if (response.ok) {
        setSubmitStatus({ message: 'Feed added successfully', isError: false });
        setNewFeedUrl('');
        const addedFeed = await response.json();
        const { id, author, url } = addedFeed;
        updateFeedHash({ [id]: { author, url }, ...feedHash });
      } else {
        throw new Error(`${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setSubmitStatus({ message: error.message, isError: true });
      console.log('Error adding feed', error);
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

  return userInfo.id ? (
    <PageBase title="My Feeds">
      <div className={classes.margin}>
        <ValidatorForm onSubmit={addFeed} instantValidate={false}>
          <Container maxWidth="xs" bgcolor="aliceblue">
            <Card>
              <Box px={2} py={1}>
                <Typography variant="h3" component="h3" align="center">
                  My Feeds
                </Typography>
                <Grid container spacing={5}>
                  <Grid item>
                    <Grid container spacing={1} alignItems="flex-end">
                      <Grid item>
                        <AccountCircle />
                      </Grid>
                      <Grid item>
                        <TextValidator
                          label="Blog feed author"
                          name="author"
                          ref={newFeedAuthorRef}
                          value={newFeedAuthor}
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
                        <Typography
                          color={submitStatus.isError ? 'error' : 'textPrimary'}
                          align="center"
                        >
                          {submitStatus.message}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <ExistingFeedList feedHash={feedHash} numFeeds={numFeeds} />
              </Box>
            </Card>
          </Container>
        </ValidatorForm>
      </div>
    </PageBase>
  ) : (
    <></>
  );
}
