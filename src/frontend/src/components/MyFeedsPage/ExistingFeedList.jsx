import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, Typography } from '@material-ui/core';
import { AccountCircle, RssFeed } from '@material-ui/icons';
import useSiteMetadata from '../../hooks/use-site-metadata';
import DeleteFeedDialogButton from './DeleteFeedDialogButton.jsx';

function ExistingFeedList({ userInfo }) {
  const [feedHash, updateFeedHash] = useState({}); // { id1: {author: '...', url: '...'}, id2: {...}, ... }
  const { telescopeUrl } = useSiteMetadata();

  useEffect(() => {
    if (userInfo.id) {
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
          console.log('Error hashing user feeds', error);
          throw error;
        }
      })();
    }
  }, [telescopeUrl, userInfo.id]);

  if (Object.keys(feedHash).length) {
    return Object.keys(feedHash).map((id) => (
      <Grid container spacing={5} key={id}>
        <Grid item>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item>
              <AccountCircle />
            </Grid>
            <Grid item>
              <TextField
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
              <TextField
                disabled
                label="Blog feed URL"
                name="url"
                value={feedHash[id].url}
                type="url"
              />
            </Grid>
            <Grid item>
              <DeleteFeedDialogButton feed={{ id, ...feedHash[id] }} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    ));
  }
  return (
    <Typography align="center">
      <em>(It looks like you have not added any blog feeds yet.)</em>
    </Typography>
  );
}

ExistingFeedList.propTypes = {
  userInfo: PropTypes.object,
};

export default React.memo(ExistingFeedList);
