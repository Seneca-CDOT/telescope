import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  footerBar: {
    top: 'auto',
    bottom: 0,
    backgroundColor: theme.palette.primary.main,
  },
  footer: {
    textAlign: 'center',
    color: theme.white,
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <AppBar position="fixed" className={classes.footerBar}>
      <Typography className={classes.footer}>
        Copyright © 2020 Seneca’s Centre for Development of Open Technology
      </Typography>
    </AppBar>
  );
};

export default Footer;
