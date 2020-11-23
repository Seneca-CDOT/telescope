import React, { useState, useEffect, useContext } from 'react';
import { navigate } from 'gatsby';
import { Box, Card, Container, Grid, IconButton, Typography } from '@material-ui/core';
import { AccountCircle, AddCircle, RssFeed } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { isWebUri } from 'valid-url';

import PageBase from './PageBase';
import useSiteMetadata from '../hooks/use-site-metadata';
import ExistingFeedList from '../components/MyFeedsPage/ExistingFeedList.jsx';
import HelpPopoverButton from '../components/MyFeedsPage/HelpPopoverButton.jsx';
import CustomizedSnackBar from '../components/SnackBar';
import { UserStateContext } from '../contexts/User/UserContext';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(2),
  },
  button: {
    padding: '3px 0 3px 0',
  },
}));

export default function MyFeeds() {
  const user = useContext(UserStateContext);
  const classes = useStyles();
  const [newFeedAuthor, setNewFeedAuthor] = useState('');
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [submitStatus, setSubmitStatus] = useState({ message: '', isError: false });
  const [feedHash, updateFeedHash] = useState([]);
  const [alert, setAlert] = useState('false');

  const { telescopeUrl } = useSiteMetadata();

  useEffect(() => {
    if (user.name === '') navigate(`${telescopeUrl}/auth/login`);
    setNewFeedAuthor(user.name);
    ValidatorForm.addValidationRule('isUrl', (value) => !!isWebUri(value));
    return ValidatorForm.removeValidationRule.bind('isUrl');
  }, []);

  useEffect(() => {
    setAlert(true);
    (async function hashUserFeeds() {
      try {
        const response = await fetch(`${telescopeUrl}/user/feeds`);

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const userFeeds = await response.json();

        const userFeedHash = userFeeds.reduce((hash, feed) => {
          hash[feed.id] = { author: feed.author, url: feed.url };
          return hash;
        }, {});

        updateFeedHash(userFeedHash);
      } catch (error) {
        console.error('Error hashing user feeds', error);
      }
    })();
  }, [telescopeUrl, user, alert]);

  async function addFeed() {
    try {
      const response = await fetch(`${telescopeUrl}/feeds`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: user.id,
          author: newFeedAuthor,
          url: newFeedUrl,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitStatus({ message: data.message, isError: false });
        setNewFeedUrl('');
        updateFeedHash({ [data.id]: { author: newFeedAuthor, url: newFeedUrl }, ...feedHash });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setSubmitStatus({ message: error.message, isError: true });
      console.error('Error adding feed', error);
    }
    setAlert(false);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === 'author') {
      setNewFeedAuthor(value);
    } else {
      setNewFeedUrl(value);
    }
  }

  function deletionCallback(id) {
    const updatedHash = { ...feedHash };
    delete updatedHash[id];
    setSubmitStatus({ message: 'Feed removed successfully', isError: false });
    setAlert(false);
    updateFeedHash(updatedHash);
  }

  return (
    <PageBase title="My Feeds">
      {user && user.id ? (
        <div className={classes.margin}>
          <ValidatorForm onSubmit={() => addFeed()} instantValidate={false}>
            <Container maxWidth="md" bgcolor="aliceblue">
              <Card>
                <Box px={2} py={1}>
                  <Typography variant="h3" component="h3" align="center">
                    My Feeds
                  </Typography>
                  <Grid container spacing={5}>
                    <Grid item xs={5} sm={4} md={3}>
                      <Grid container spacing={1} alignItems="flex-end">
                        <Grid item xs={'auto'}>
                          <AccountCircle />
                        </Grid>
                        <Grid item xs={8} sm={10}>
                          <TextValidator
                            label="Blog feed author"
                            name="author"
                            value={newFeedAuthor}
                            onChange={handleChange}
                            type="string"
                            validators={['required', 'trim']}
                            errorMessages={"Please enter the blog's author."}
                            fullWidth
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={7} sm={8} md={9}>
                      <Grid container spacing={1} alignItems="flex-end">
                        <Grid item xs={'auto'}>
                          <RssFeed />
                        </Grid>
                        <Grid item xs={8} sm={10} md={11}>
                          <TextValidator
                            label="Blog feed URL"
                            name="url"
                            value={newFeedUrl}
                            onChange={handleChange}
                            type="url"
                            validators={['required', 'isUrl']}
                            errorMessages={"Please enter the blog's feed URL."}
                            fullWidth
                          />
                        </Grid>
                        <Grid item xs={'auto'}>
                          <HelpPopoverButton />
                        </Grid>
                      </Grid>
                      <Grid container spacing={2}>
                        <Grid item>
                          <IconButton classes={{ root: classes.button }} type="submit">
                            <AddCircle color="secondary" />
                          </IconButton>
                          {alert === true && submitStatus.message !== '' ? (
                            <CustomizedSnackBar message={submitStatus.message} open={alert} />
                          ) : null}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <ExistingFeedList feedHash={feedHash} deletionCallback={deletionCallback} />
                </Box>
              </Card>
            </Container>
          </ValidatorForm>
        </div>
      ) : (
        <></>
      )}
    </PageBase>
  );
}
