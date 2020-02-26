import React from 'react';
import { Container, Box, Typography, TextField, Grid, Card, IconButton } from '@material-ui/core';
import { AccountCircle, RssFeed, HelpOutline, Add } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(2),
  },
  button: {
    padding: '3px 0 3px 0',
  },
}));

function addFeed(feedAuthor, feedUrl) {
  const http = new XMLHttpRequest();
  const url = 'http://localhost:3000/feeds/';
  const params = `author=${feedAuthor}&url=${feedUrl}`;
  http.open('POST', url, true);
  http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  http.send(params);
}

export default function MyFeeds() {
  const classes = useStyles();

  return (
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
                    <TextField id="author" label="John Doe" disabled />
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
                      onBlur={addFeed(
                        document.getElementById('id'),
                        document.getElementById('url')
                      )}
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
                    <IconButton classes={{ root: classes.button }}>
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
  );
}
