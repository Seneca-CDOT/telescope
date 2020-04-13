import React from 'react';
import PropTypes from 'prop-types';
import { Grid, TextField, Typography } from '@material-ui/core';
import { AccountCircle, RssFeed } from '@material-ui/icons';
import DeleteFeedDialogButton from './DeleteFeedDialogButton.jsx';

function ExistingFeedList({ feedHash, deletionCallback }) {
  return Object.keys(feedHash).length ? (
    Object.keys(feedHash).map((id) => (
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
