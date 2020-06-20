import React from 'react';
import { Link } from 'gatsby';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import LogoIcon from '../LogoIcon';
import Login from '../Login';
import HideOnScroll from '../HideOnScroll';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: '#242424',
  },
  toolbar: theme.mixins.toolbar,
  menuIcon: {
    fontSize: '2.5rem',
  },
  searchIcon: {
    fontSize: '2.5rem',
    color: 'white',
  },
  logo: {
    flexGrow: 1,
    margin: '0 0.5rem 0 0.5rem',
  },
  links: {
    color: 'white',
    fontFamily: 'Roboto, sans-serif',
    textDecoration: 'none',
    fontSize: '1.5rem',
    margin: '0 0.5rem 0 0.5rem',
  },
  button: {
    float: 'right',
    margin: '0 0.5rem 0 0.5rem',
  },
  list: {
    width: 250,
  },
  paper: {
    background: '#242424',
  },
  line: {
    backgroundColor: '#525252',
  },
  item: {
    color: 'white',
    fontFamily: 'Roboto, sans-serif',
    textDecoration: 'none',
    fontSize: '1.5rem',
    justifyContent: 'center',
    fontWeight: 500,
    lineHeight: 1.75,
  },
  footer: {
    textAlign: 'center',
    color: 'white',
    bottom: 5,
    position: 'fixed',
  },
}));

export default function DesktopHeader() {
  const classes = useStyles();

  return (
    <>
      <HideOnScroll>
        <AppBar position="fixed" className={classes.root}>
          <Toolbar>
            <Link to="/" title="Home" className={classes.logo}>
              <LogoIcon height="45" width="45" />
            </Link>
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
      </HideOnScroll>
      <Toolbar className={classes.toolbar}></Toolbar>
    </>
  );
}
