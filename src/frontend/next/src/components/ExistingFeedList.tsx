import { Grid, TextField, Typography } from '@material-ui/core';
import { AccountCircle, RssFeed } from '@material-ui/icons';
import { FeedHash } from '../interfaces';
import DeleteFeedDialogButton from './DeleteFeedDialogButton';

type ExistingFeedListProps = {
  feedHash: FeedHash;
  deletionCallback: (id: number) => void;
};

function ExistingFeedList({ feedHash, deletionCallback }: ExistingFeedListProps) {
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
                value={feedHash[id as keyof FeedHash].author}
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
                value={feedHash[id as keyof FeedHash].url}
                type="url"
                fullWidth
              />
            </Grid>
            <Grid item xs="auto">
              <DeleteFeedDialogButton
                feed={{ id, ...feedHash[id as keyof FeedHash] }}
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

const areEqual = (prevProps: ExistingFeedListProps, nextProps: ExistingFeedListProps) => {
  return Object.keys(prevProps.feedHash).length === Object.keys(nextProps.feedHash).length;
};

export { areEqual };

export default ExistingFeedList;
