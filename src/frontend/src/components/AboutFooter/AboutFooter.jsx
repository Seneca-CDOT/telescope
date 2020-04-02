import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography, List, ListItem, SvgIcon } from '@material-ui/core';

import GitHubIcon from '@material-ui/icons/GitHub';

import Logo from '../../images/logo.svg';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.primary.main,
    padding: '2rem',
  },
  heading: {
    color: 'white',
    textDecorationLine: 'underline',
  },
  links: {
    color: 'white',
    textDecorationLine: 'none',
    '&:hover': {
      textDecorationLine: 'underline',
    },
    alignItems: 'flex-start',
  },
  footer: {
    color: 'white',
  },
}));

const AboutFooter = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid container direction="row" justify="space-between" alignItems="flex-start">
        <Grid item xs={6} sm={3}>
          <Typography variant="h6" className={classes.heading}>
            DOCS
          </Typography>
          <Typography>
            <a
              href="https://github.com/Seneca-CDOT/telescope/blob/master/docs/environment-setup.md"
              className={classes.links}
            >
              Get Started
            </a>
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="h6" className={classes.heading}>
            MORE
          </Typography>
          <Typography>
            <a
              href="https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List"
              className={classes.links}
            >
              Planet CDOT Feed List
            </a>
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <SvgIcon fontSize="large">
            <img src={Logo}></img>
          </SvgIcon>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="h6" className={classes.heading}>
            COMMUNITY
          </Typography>
          <List>
            <ListItem>
              <a href="https://github.com/Seneca-CDOT/telescope" className={classes.links}>
                {' '}
                <GitHubIcon></GitHubIcon>
              </a>
            </ListItem>
            <ListItem>
              <a
                href="https://seneca-open-source.slack.com/archives/CS5DGCAE5"
                className={classes.links}
              >
                Slack
              </a>
            </ListItem>
          </List>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography className={classes.footer}>
          Copyright © 2020 Seneca’s Centre for Development of Open Technology
        </Typography>
      </Grid>
    </Grid>
  );
};

export default AboutFooter;
