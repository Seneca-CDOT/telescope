import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar, Grid, IconButton, List, ListItem, Drawer, Divider } from '@material-ui/core';
import { Link } from 'gatsby';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import useSiteMetadata from '../../hooks/use-site-metadata';
import { UserStateContext, UserDispatchContext } from '../../contexts/User/UserContext';
import Login from '../Login';
import Footer from '../Footer';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: '#333E64',
    justifyContent: 'center',
    height: '6em',
    position: 'fixed',
    bottom: 0,
  },
  iconButton: {
    fontSize: '3rem',
    color: '#E5E5E5',
  },
  iconButtonContainer: {
    textAlign: 'center',
  },
  menuIcon: {
    fontSize: '2.5rem',
  },
  button: {
    float: 'right',
    margin: '0 0.5rem 0 0.5rem',
  },
  paper: {
    backgroundColor: theme.palette.primary.main,
  },
  line: {
    backgroundColor: theme.palette.background.default,
  },
  item: {
    color: theme.palette.background.default,
    fontFamily: 'Roboto, sans-serif',
    textDecoration: 'none',
    fontSize: '1.5rem',
    justifyContent: 'center',
    fontWeight: 500,
    lineHeight: 1.75,
  },
  list: {
    width: 250,
  },
}));

function getCellStyle(path) {
  if (window.location.pathname === path) {
    return {
      color: '#8BC2EB',
    };
  }
  return {
    color: '#E5E5E5',
  };
}

export default function MobileBottomBar() {
  const classes = useStyles();
  const { telescopeUrl } = useSiteMetadata();
  const user = useContext(UserStateContext);
  const dispatch = useContext(UserDispatchContext);

  const [loggedIn, setLoggedIn] = useState(false);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (side, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerOpen(open);
  };

  const sideList = (side) => (
    <div
      className={classes.list}
      role="presentation"
      onClick={toggleDrawer(side, false)}
      onKeyDown={toggleDrawer(side, false)}
    >
      <List className={classes.item}>
        <ListItem button component={Link} to="/" className={classes.item}>
          HOME
        </ListItem>
        <Divider className={classes.line} />
        <ListItem button component={Link} to="/about" className={classes.item}>
          ABOUT
        </ListItem>
        <Divider className={classes.line} />
        <Login style={classes.item} />
        <Divider className={classes.line} />
        <div className={classes.footer}>
          <Footer />
        </div>
      </List>
    </div>
  );

  useEffect(() => {
    // Try to get user session info from the server.
    async function getUserInfo() {
      if (user && user.name) return;
      try {
        // See if the server has session info on this user
        const response = await fetch(`${telescopeUrl}/user/info`);
        console.log(response);
        if (!response.ok) {
          // Not an error, we're just not authenticated
          if (response.status === 403) {
            return;
          }
          throw new Error(response.statusText);
        }

        const userInfo = await response.json();
        if (userInfo && userInfo.email && userInfo.name) {
          dispatch({ type: 'LOGIN_USER', payload: userInfo });
        }
      } catch (error) {
        console.error('Error getting user info', error);
      }
    }

    getUserInfo();
  }, [telescopeUrl, dispatch, user]);

  useEffect(() => {
    setLoggedIn(user && user.name);
  }, [user]);
  return (
    <>
      <div className={classes.root}>
        <Toolbar>
          <Grid container alignItems="center" justify="space-between">
            <Grid className={classes.iconButtonContainer} item xs={3}>
              <Link to="/">
                <HomeIcon className={classes.iconButton} style={getCellStyle('/')} />
              </Link>
            </Grid>
            <Grid className={classes.iconButtonContainer} item xs={3}>
              <Link to="/search">
                <SearchIcon className={classes.iconButton} style={getCellStyle('/search')} />
              </Link>
            </Grid>
            <Grid className={classes.iconButtonContainer} item xs={3}>
              {loggedIn ? (
                <Link to="/myfeeds">
                  <PersonIcon className={classes.iconButton} style={getCellStyle('/myfeeds')} />
                </Link>
              ) : (
                <Link to={`${telescopeUrl}/auth/login`}>
                  <ExitToAppIcon
                    className={classes.iconButton}
                    style={getCellStyle('/auth/login')}
                  />
                </Link>
              )}
            </Grid>
            <Grid className={classes.iconButtonContainer} item xs={3}>
              <IconButton
                onClick={toggleDrawer('right', true)}
                edge="start"
                color="inherit"
                aria-label="menu"
                className={classes.button}
              >
                <MenuIcon className={classes.iconButton} />
              </IconButton>
              <Drawer
                classes={{ paper: classes.paper }}
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer('right', false)}
              >
                {sideList('right')}
              </Drawer>
            </Grid>
          </Grid>
        </Toolbar>
      </div>
    </>
  );
}
