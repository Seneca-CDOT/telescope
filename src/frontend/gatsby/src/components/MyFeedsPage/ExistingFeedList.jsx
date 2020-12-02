import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, Typography } from '@material-ui/core';
import { AccountCircle, RssFeed } from '@material-ui/icons';
import DeleteFeedDialogButton from './DeleteFeedDialogButton.jsx';

function ExistingFeedList({ feedHash, deletionCallback }) {
  return Object.keys(feedHash).length ? (
    Object.keys(feedHash).map((id) => (
      <Grid container spacing={5} key={id}>
        <Grid item xs={5} sm={4} md={3}>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item xs="auto">
              <AccountCircle />
            </Grid>
            <Grid item xs={8} sm={10}>
              <TextField
                disabled
                label="Blog feed author"
                name="author"
                value={feedHash[id].author}
                type="string"
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
              <TextField
                disabled
                label="Blog feed URL"
                name="url"
                value={feedHash[id].url}
                type="url"
                fullWidth
              />
            </Grid>
            <Grid item xs="auto">
              <DeleteFeedDialogButton
                feed={{ id, ...feedHash[id] }}
                deletionCallback={deletionCallback}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    ))
  ) : (
    <Typography align="center">
      <em>(It looks like you have not added any blog feeds yet.)</em>
    </Typography>
  );
}

ExistingFeedList.propTypes = {
  feedHash: PropTypes.object,
  deletionCallback: PropTypes.func,
};

const areEqual = (prevProps, nextProps) => {
  return Object.keys(prevProps.feedHash).length === Object.keys(nextProps.feedHash).length;
};

export default React.memo(ExistingFeedList, areEqual);
