import React from 'react';
import { Link } from 'gatsby';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar } from '@material-ui/core';

import LogoIcon from '../LogoIcon';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'primary',
    justifyContent: 'center',
    height: '8em',
    [theme.breakpoints.down(1065)]: {
      height: '6.5em',
    },
  },
  toolbar: theme.mixins.toolbar,
  logoIcon: {
    margin: '0 0.5rem 0 0.5rem',
  },
  grow: {
    flexGrow: 1,
  },
}));

export default function MobileHeader() {
  const classes = useStyles();

  return (
    <>
      <AppBar position="sticky" className={classes.root}>
        <Toolbar>
          <Link to="/" title="Home" className={classes.logoIcon}>
            <LogoIcon height="45" width="45" />
          </Link>
          <div className={classes.grow} />
        </Toolbar>
      </AppBar>
    </>
  );
}
