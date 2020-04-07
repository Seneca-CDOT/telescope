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
              <DeleteFeedDialogButton feed={feedHash[id]} />
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
