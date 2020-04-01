import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { Typography, List, ListItem } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.primary.main,
    padding: '1rem',
  },
  heading: {
    color: 'white',
  },
  links: {
    color: 'white',
    textDecorationLine: 'none',
    '&:hover': {
      textDecorationLine: 'underline',
    },
  },
}));

const AboutFooter = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} sm={4} className={classes.heading}>
        <Typography className={classes.heading}>DOCS</Typography>
        <List>
          <ListItem>
            <a
              href="https://github.com/Seneca-CDOT/telescope/blob/master/docs/environment-setup.md"
              className={classes.links}
            >
              Get Started
            </a>
          </ListItem>
        </List>
      </Grid>
      <Grid item xs={12} sm={4} className={classes.heading}>
        <Typography className={classes.heading}>COMMUNITY</Typography>
        <List>
          <ListItem>
            <a href="https://github.com/Seneca-CDOT/telescope" className={classes.links}>
              GitHub
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
      <Grid item xs={12} sm={4} className={classes.heading}>
        <Typography className={classes.heading}>MORE</Typography>
        <List>
          <ListItem>
            <a
              href="https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List"
              className={classes.links}
            >
              Planet CDOT Feed List
            </a>
          </ListItem>
        </List>
      </Grid>
    </Grid>
  );
};

export default AboutFooter;
