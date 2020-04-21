import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'gatsby';
import { makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  Drawer,
  Divider,
  useScrollTrigger,
  Slide,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';

import useSiteMetadata from '../../hooks/use-site-metadata';

import Login from '../Login';
import Footer from '../Footer';

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
  title: {
    flexGrow: 1,
    marginLeft: '1rem',
    color: '#a4d4ff',
    textDecoration: 'none',
    '&:hover': {
      color: 'white',
    },
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

function HideOnScroll(props) {
  const { children, window } = props;

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    threshold: 700,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

const MobileHeader = () => {
  const { title } = useSiteMetadata();
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (side, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  const sideList = (side) => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List className={classes.item}>
        <ListItem button component={Link} className={classes.item}>
          HOME
        </ListItem>
        <Divider className={classes.line} />
        <ListItem button component={Link} to="/about" className={classes.item}>
          ABOUT
        </ListItem>
        <Divider className={classes.line} />
        <ListItem button className={classes.item}>
          <Login />
        </ListItem>
        <Divider className={classes.line} />
        <div className={classes.footer}>
          <Footer />
        </div>
      </List>
    </div>
  );

  return (
    <>
      <HideOnScroll>
        <AppBar position="fixed" className={classes.root}>
          <Toolbar>
            <Typography variant="h3" className={classes.title}>
              <Link to="/" title="Home" className={classes.title}>
                {title}
              </Link>
            </Typography>
            <IconButton color="inherit" className={classes.button}>
              <Link to="/search">
                <SearchIcon className={classes.searchIcon} />
              </Link>
            </IconButton>
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
      </HideOnScroll>
      <Toolbar className={classes.toolbar}></Toolbar>
    </>
  );
};

export default MobileHeader;
