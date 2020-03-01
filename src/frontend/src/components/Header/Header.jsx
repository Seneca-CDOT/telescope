import React from 'react';
import { Link } from 'gatsby';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button, Typography, IconButton } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

import useSiteMetadata from '../../hooks/use-site-metadata';

import Login from '../Login';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    backgroundColor: '#242424',
  },
  menuIcon: {
    fontSize: '2.5rem',
  },
  searchIcon: {
    fontSize: '2.5rem',
    color: 'white',
  },
  title: {
    flexGrow: 1,
    marginLeft: '1rem',
    color: '#a4d4ff',
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
});

const Header = () => {
  const { title } = useSiteMetadata();
  const classes = useStyles();

  return (
    <div>
      <AppBar position="fixed" className={classes.root}>
        <Toolbar>
          <Typography variant="h3" className={classes.title}>
            {title}
          </Typography>
          <IconButton color="inherit" className={classes.button}>
            <Link to="/search">
              <SearchIcon className={classes.searchIcon} />
            </Link>
          </IconButton>
          <Button color="inherit" size="medium" className={classes.button}>
            <Link to="/" className={classes.links}>
              Home
            </Link>
          </Button>
          <Login />
          <IconButton edge="start" color="inherit" aria-label="menu" className={classes.button}>
            <MenuIcon className={classes.menuIcon} />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
