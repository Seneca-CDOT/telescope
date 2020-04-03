import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Grid, Card, IconButton } from '@material-ui/core';
import { AccountCircle, RssFeed, HelpOutline, Add } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

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

export default function MyFeeds() {
  const classes = useStyles();
  const [feedAuthor, setFeedAuthor] = useState('');
  const [feedUrl, setFeedUrl] = useState('');
  const { telescopeUrl } = useSiteMetadata();

  function handleAuthorChange(author) {
    setFeedAuthor(author);
  }

  function handleUrlChange(url) {
    setFeedUrl(url);
  }

  async function addFeed() {
    try {
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
      return response;
    } catch (error) {
      console.log({ error });
      return { error };
    }
  }

  return (
    <PageBase>
      <div className={classes.margin}>
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
                      <TextField
                        id="author"
                        label="John Doe"
                        onBlur={(event) => handleAuthorChange(event.target.value)}
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
                      <TextField
                        id="url"
                        label="Blog feed URL"
                        onBlur={(event) => handleUrlChange(event.target.value)}
                      />
                    </Grid>
                    <Grid item>
                      <IconButton color="primary" classes={{ root: classes.button }}>
                        <HelpOutline />
                      </IconButton>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item>
                      <IconButton classes={{ root: classes.button }} onClick={() => addFeed()}>
                        <Add />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Container>
      </div>
    </PageBase>
  );
}
