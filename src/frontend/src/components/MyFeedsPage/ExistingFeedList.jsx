import React from 'react';
import PropTypes from 'prop-types';
import { TextValidator } from 'react-material-ui-form-validator';
import { Grid, Typography } from '@material-ui/core';
import { AccountCircle, RssFeed } from '@material-ui/icons';
import DeleteFeedDialogButton from './DeleteFeedDialogButton.jsx';

function ExistingFeedList({ feedHash }) {
  if (Object.keys(feedHash).length) {
    return Object.keys(feedHash).map((id) => (
      <Grid container spacing={5} key={id}>
        <Grid item xs={6}>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item xs={1}>
              <AccountCircle />
            </Grid>
            <Grid item xs={10}>
              <TextValidator
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
        <Grid item xs={6}>
          <Grid container spacing={1} alignItems="flex-end">
            <Grid item xs={1}>
              <RssFeed />
            </Grid>
            <Grid item xs={10}>
              <TextValidator
                disabled
                label="Blog feed URL"
                name="url"
                value={feedHash[id].url}
                type="url"
                fullWidth
              />
            </Grid>
            <Grid item xs={1}>
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
  feedHash: PropTypes.object,
};

export default ExistingFeedList;
