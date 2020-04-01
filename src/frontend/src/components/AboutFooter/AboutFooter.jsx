import React from 'react';
import { Link } from 'gatsby';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography, List, ListItem } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  links: {
    textDecoration: 'none',
  },
  footer: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const AboutFooter = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} sm={4}>
        <Typography>Docs</Typography>
        <List>
          <ListItem>
            <Link to="/search" className={classes.links}>
              Get Started
            </Link>
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography>Community</Typography>
        <List>
          <ListItem>
            <Link to="/search" className={classes.links}>
              Get Started
            </Link>
          </ListItem>
          <ListItem>
            <Link to="/search" className={classes.links}>
              Planet CDOT Feed List
            </Link>
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Typography>Social</Typography>
        <List>
          <ListItem>
            <Link to="/search" className={classes.links}>
              GitHub
            </Link>
          </ListItem>
          <ListItem>
            <Link to="/search" className={classes.links}>
              Slack
            </Link>
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={12} sm={12}>
        <Typography className={classes.footer}>
          Copyright © 2020 Seneca’s Centre for Development of Open Technology
        </Typography>
      </Grid>
    </Grid>
  );
};

export default AboutFooter;
