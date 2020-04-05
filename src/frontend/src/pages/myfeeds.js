import React, { useState, useEffect } from 'react';
import { Container, Box, Typography, Grid, Card, IconButton, Popover } from '@material-ui/core';
import { AccountCircle, RssFeed, HelpOutline, Add } from '@material-ui/icons';
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
            color="primary"
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

export default function MyFeeds() {
  const classes = useStyles();
  const [feedAuthor, setFeedAuthor] = useState('');
  const [feedUrl, setFeedUrl] = useState('');
  const [submitStatus, setSubmitStatus] = useState({ message: '', isError: false });

  const { telescopeUrl } = useSiteMetadata();

  const feedAuthorRef = React.createRef();
  const feedUrlRef = React.createRef();
  const formRef = React.createRef();

  useEffect(() => {
    ValidatorForm.addValidationRule('isUrl', (value) => !!isWebUri(value));
    return ValidatorForm.removeValidationRule.bind('isUrl');
  }, []);

  function handleAuthorChange(author) {
    setFeedAuthor(author);
  }

  function handleUrlChange(url) {
    setFeedUrl(url);
  }

  async function addFeed() {
    try {
      setSubmitStatus({ message: 'Saving feeds, please wait...' });
      const response = await fetch(`${telescopeUrl}/feeds`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          author: feedAuthor,
          url: feedUrl,
        }),
      });
      console.log(response);
      setSubmitStatus(
        response.ok
          ? { message: 'Feeds updated successfully' }
          : { message: `Error: ${response.status} ${response.statusText}`, isError: true }
      );
      return response;
    } catch (error) {
      setSubmitStatus({ message: error.message, isError: true });
      console.log({ error });
      return { error };
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    if (name === 'author') {
      handleAuthorChange(value);
    } else {
      handleUrlChange(value);
    }
  }

  function handleBlur(event) {
    const { name, value } = event.target;
    if (name === 'author') {
      feedAuthorRef.current.validate(value, true);
    } else {
      feedUrlRef.current.validate(value, true);
    }
  }

  return (
    <PageBase title="My Feeds">
      <div className={classes.margin}>
        <ValidatorForm ref={formRef} onSubmit={addFeed}>
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
                          ref={feedAuthorRef}
                          value={feedAuthor}
                          onBlur={handleBlur}
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
                          ref={feedUrlRef}
                          value={feedUrl}
                          onBlur={handleBlur}
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
                          <Add />
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
