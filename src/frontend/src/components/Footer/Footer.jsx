import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    top: 'auto',
    bottom: 0,
    backgroundColor: theme.palette.primary.main,
  },
  footer: {
    textAlign: 'center',
    color: 'white',
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <Typography className={classes.footer}>
          Copyright © 2020 Seneca’s Centre for Development of Open Technology
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Footer;
