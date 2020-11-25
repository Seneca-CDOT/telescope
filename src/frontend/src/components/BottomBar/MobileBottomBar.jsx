import React, { useState, useEffect, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Toolbar, Grid } from '@material-ui/core';
import { Link } from 'gatsby';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import PersonIcon from '@material-ui/icons/Person';
import useSiteMetadata from '../../hooks/use-site-metadata';
import { UserStateContext, UserDispatchContext } from '../../contexts/User/UserContext';

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
}));

function getCellStyle(path) {
  if (window.location.pathname === path) {
    return {
      color: '#8BC2EB',
    };
  }
}

export default function MobileBottomBar() {
  const classes = useStyles();
  const { telescopeUrl } = useSiteMetadata();
  const user = useContext(UserStateContext);
  const dispatch = useContext(UserDispatchContext);

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Try to get user session info from the server.
    async function getUserInfo() {
      if (user && user.name) return;
      try {
        // See if the server has session info on this user
        const response = await fetch(`${telescopeUrl}/user/info`);

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
  }, [telescopeUrl, dispatch]);

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
                <Link to="/auth/login">
                  <ExitToAppIcon
                    className={classes.iconButton}
                    style={getCellStyle('/auth/login')}
                  />
                </Link>
              )}
            </Grid>
            <Grid className={classes.iconButtonContainer} item xs={3}>
              <Link to="/MenuIcon">
                <MenuIcon className={classes.iconButton} style={getCellStyle('/MenuIcon')} />
              </Link>
            </Grid>
          </Grid>
        </Toolbar>
      </div>
    </>
  );
}
