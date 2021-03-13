import { useState, useEffect, FormEvent } from 'react';
import { Box, Card, Container, Grid, IconButton, Typography } from '@material-ui/core';
import { AccountCircle, AddCircle, RssFeed } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { isWebUri } from 'valid-url';

import { userFeedsUrl, feedsUrl } from '../config';
import ExistingFeedList from './ExistingFeedList';
import HelpPopoverButton from './HelpPopoverButton';
import CustomizedSnackBar from './SnackBar';
import { Feed, FeedHash } from '../interfaces';
import User from '../User';

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(2),
  },
  button: {
    padding: '3px 0 3px 0',
  },
}));

type MyFeedsProps = {
  user: User;
};

const MyFeeds = ({ user }: MyFeedsProps) => {
  const classes = useStyles();
  const [newFeedAuthor, setNewFeedAuthor] = useState(user.name);
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [submitStatus, setSubmitStatus] = useState({ message: '', isError: false });
  const [feedHashObject, updateFeedHashObject] = useState({});
  const [alert, setAlert] = useState(false);

  useEffect(() => {
    setNewFeedAuthor(user.name);
    ValidatorForm.addValidationRule('isUrl', (value: string) => !!isWebUri(value));
    return function () {
      ValidatorForm.removeValidationRule.bind('isUrl');
    };
  }, [user.name]);

  useEffect(() => {
    setAlert(true);
    (async function hashUserFeeds() {
      try {
        const response = await fetch(userFeedsUrl);

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const userFeeds = await response.json();

        const userFeedHash = userFeeds.reduce((hash: FeedHash, feed: Feed) => {
          hash[feed.id] = { author: feed.author, url: feed.url, link: feed.link };
          return hash;
        }, {});

        updateFeedHashObject(userFeedHash);
      } catch (error) {
        console.error('Error hashing user feeds', error);
      }
    })();
  }, [userFeedsUrl, alert]);

  async function addFeed() {
    try {
      const response = await fetch(feedsUrl, {
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
        updateFeedHashObject({
          [data.id]: { author: newFeedAuthor, url: newFeedUrl },
          ...feedHashObject,
        } as FeedHash);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setSubmitStatus({ message: error.message, isError: true });
      console.error('Error adding feed', error);
    }
    setAlert(false);
  }

  function handleChange(event: FormEvent<HTMLInputElement>) {
    const { name, value } = event.target as HTMLInputElement;
    if (name === 'author') {
      setNewFeedAuthor(value);
    } else {
      setNewFeedUrl(value);
    }
  }

  function deletionCallback(id: string) {
    const updatedHash: FeedHash = { ...feedHashObject };
    delete updatedHash[id];
    setSubmitStatus({ message: 'Feed removed successfully', isError: false });
    setAlert(false);
    updateFeedHashObject(updatedHash);
  }

  return (
    <div className={classes.margin}>
      <ValidatorForm onSubmit={() => addFeed()} instantValidate={false}>
        <Container maxWidth="md">
          <Card>
            <Box px={2} py={1}>
              <Typography variant="h3" component="h3" align="center">
                My Feeds
              </Typography>
              <Grid container spacing={5}>
                <Grid item xs={5} sm={4} md={3}>
                  <Grid container spacing={1} alignItems="flex-end">
                    <Grid item xs="auto">
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
                    <Grid item xs="auto">
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
                    <Grid item xs="auto">
                      <HelpPopoverButton />
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item>
                      <IconButton classes={{ root: classes.button }} type="submit">
                        <AddCircle color="secondary" />
                      </IconButton>
                      {alert === true && submitStatus.message !== '' && (
                        <CustomizedSnackBar message={submitStatus.message} isOpen={alert} />
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <ExistingFeedList feedHash={feedHashObject} deletionCallback={deletionCallback} />
            </Box>
          </Card>
        </Container>
      </ValidatorForm>
    </div>
  );
};

export default MyFeeds;
