import React from 'react';
import { Link } from 'gatsby';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import LogoIcon from '../LogoIcon';
import Login from '../Login';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'primary',
  },
  toolbar: theme.mixins.toolbar,
  logoIcon: {
    margin: '0 0.5rem 0 0.5rem',
  },
  grow: {
    flexGrow: 1,
  },
  searchIcon: {
    fontSize: '2.5rem',
    color: theme.palette.text.primary,
  },
  button: {
    float: 'right',
    margin: '0 0.5rem 0 0.5rem',
  },
  links: {
    color: theme.palette.text.primary,
    fontFamily: 'Roboto, sans-serif',
    textDecoration: 'none',
    fontSize: '1.5rem',
    margin: '0 0.5rem 0 0.5rem',
  },
}));

export default function DesktopHeader() {
  const classes = useStyles();

  return (
    <>
      <AppBar position="sticky" className={classes.root}>
        <Toolbar>
          <Link to="/" title="Home" className={classes.logoIcon}>
            <LogoIcon height="45" width="45" />
          </Link>
          <div className={classes.grow} />
          <IconButton color="inherit" className={classes.button} aria-label="search">
            <Link to="/search">
              <SearchIcon className={classes.searchIcon} />
            </Link>
          </IconButton>
          <Button color="inherit" size="medium" className={classes.button}>
            <Link to="/" className={classes.links}>
              Home
            </Link>
          </Button>
          <Button color="inherit" size="medium" className={classes.button}>
            <Link to="/about" className={classes.links}>
              About
            </Link>
          </Button>
          <Login />
        </Toolbar>
      </AppBar>
    </>
  );
}
