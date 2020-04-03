import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Box, Typography, SvgIcon } from '@material-ui/core';

import GitHubIcon from '@material-ui/icons/GitHub';

import Logo from '../../images/logo.svg';

const useStyles = makeStyles((theme) => ({
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
      <Box width={1} pb={5}>
        <Grid container direction="row" justify="space-between" alignItems="flex-start">
          <Grid container item xs={12} sm={3}>
            <Grid container item xs={12} sm={6}>
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
            <Grid container item xs={12} sm={6}>
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
          </Grid>
          <Grid container item xs={12} sm={6} justify={'center'}>
            <Typography variant="h6" className={classes.heading}>
              LOGO
            </Typography>
            <SvgIcon fontSize="large">
              <img src={Logo}></img>
            </SvgIcon>
          </Grid>
          <Grid container item xs={12} sm={3} justify={'flex-end'}>
            <Typography variant="h6" className={classes.heading}>
              COMMUNITY
            </Typography>
            <a href="https://github.com/Seneca-CDOT/telescope" className={classes.links}>
              {' '}
              <GitHubIcon></GitHubIcon>
            </a>
            <a
              href="https://seneca-open-source.slack.com/archives/CS5DGCAE5"
              className={classes.links}
            >
              Slack
            </a>
          </Grid>
        </Grid>
      </Box>
      <Grid item xs={12}>
        <Typography className={classes.footer}>
          Copyright © 2020 Seneca’s Centre for Development of Open Technology
        </Typography>
      </Grid>
    </Grid>
  );
};

export default AboutFooter;
