import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Avatar, Grid } from '@material-ui/core';
import useTelescopeContributor from '../../hooks/use-telescope-contributor';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.light,
  },
  typography: {
    fontSize: 13,
  },
  links: {
    color: theme.palette.text.secondary,
    textDecorationLine: 'none',
    '&:hover': {
      textDecorationLine: 'underline',
    },
    alignItems: 'flex-start',
  },
}));

const GitHubContributorCard = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { contributor, error } = useTelescopeContributor();

  return { contributor } ? (
    <Card className={classes.root}>
      <CardContent>
        <Grid container direction="row" alignItems="center">
          <Grid item xs={2}>
            <Avatar alt="Profile Picture" src={contributor?.avatar_url} />
          </Grid>
          <Grid item xs={10} justify="flex-end">
            <Typography className={classes.typography}>
              Thank you{' '}
              <a href={contributor?.html_url} className={classes.links}>
                {contributor?.login}
              </a>
              , for being a{' '}
              <a
                href="https://github.com/Seneca-CDOT/telescope/graphs/contributors"
                className={classes.links}
              >
                Telescope project contributor
              </a>
              , with your
              <a
                href={
                  'https://github.com/Seneca-CDOT/telescope/commits?author=' + contributor?.login
                }
                className={classes.links}
              >
                {' '}
                {contributor?.contributions} contribution(s)
              </a>
              .
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  ) : null;
};

export default GitHubContributorCard;
