import React from 'react';
import { Link } from 'gatsby';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
  List,
  ListItem,
  Drawer,
  Divider,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

import useSiteMetadata from '../../hooks/use-site-metadata';

import Login from '../Login';

const useStyles = makeStyles(theme => ({
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
    textAlign: 'center',
  },
}));

const Header = () => {
  const { title } = useSiteMetadata();
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (side, open) => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  const sideList = side => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List>
        <ListItem className={classes.item}>
          <Link to="/search" className={classes.links}>
            Search
          </Link>
        </ListItem>
        <Divider className={classes.line} />
      </List>
    </div>
  );

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
          <Button color="inherit" size="medium" className={classes.button}>
            <Link to="/about" className={classes.links}>
              About
            </Link>
          </Button>
          <Login />
          <IconButton
            onClick={toggleDrawer('right', true)}
            edge="start"
            color="inherit"
            aria-label="menu"
            className={classes.button}
          >
            <MenuIcon className={classes.menuIcon} />
          </IconButton>
          <Drawer
            classes={{ paper: classes.paper }}
            anchor="right"
            open={state.right}
            onClose={toggleDrawer('right', false)}
          >
            {sideList('right')}
          </Drawer>
        </Toolbar>
      </AppBar>
      <Toolbar className={classes.toolbar}></Toolbar>
    </div>
  );
};

export default Header;
