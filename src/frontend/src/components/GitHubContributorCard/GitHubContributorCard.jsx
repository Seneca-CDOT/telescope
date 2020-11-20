import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Avatar, Grid } from '@material-ui/core';
import { fetch } from 'whatwg-fetch';

const telescopeGitHubContributorsUrl =
  'https://api.github.com/repos/Seneca-CDOT/telescope/contributors';

const pickRandomContributor = (contributors) =>
  contributors[Math.floor(Math.random() * contributors.length)];

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.light,
  },
  typography: {
    fontSize: '13px',
  },
  link: {
    color: theme.palette.text.secondary,
    textDecorationLine: 'none',
    '&:hover': {
      textDecorationLine: 'underline',
    },
    alignItems: 'flex-start',
  },
}));

const Component = () => {
  const [contributor, setContributor] = useState(null);
  const classes = useStyles();
  const theme = useTheme();

  useEffect(() => {
    (async () => {
      const response = await fetch(telescopeGitHubContributorsUrl);

      if (!response.ok) throw new Error('Sh**, an error...');

      return pickRandomContributor(await response.json());
    })()
      .then((result) => setContributor(result))
      .catch((error) => console.error(error));
  }, []);

  return contributor ? (
    <Fragment>
      <Card className={classes.root}>
        <CardContent>
          <Grid container direction="row" alignItems="center">
            <Grid item xs={2}>
              <Avatar alt="Profile Picture" src={contributor.avatar_url} />
            </Grid>
            <Grid item xs={10} justify="flex-end">
              <Typography>
                Thank you&nbsp;
                <a href={contributor.html_url}>{contributor.login}</a>, for being a&nbsp;
                <a href="https://github.com/Seneca-CDOT/telescope/graphs/contributors">
                  Telescope project contributor
                </a>
                , with your
                <a
                  href={
                    'https://github.com/Seneca-CDOT/telescope/commits?author=' + contributor.login
                  }
                >
                  &nbsp;
                  <b>{contributor.contributions} Contributions</b>
                </a>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Fragment>
  ) : (
    <Fragment>loading...</Fragment>
  );
};

export default Component;
