import { useEffect, useContext, Fragment } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { ListItem } from '@material-ui/core';
import LoggedIn from './LoggedIn';
import LoggedOut from './LoggedOut';
import { UserStateContext, UserDispatchContext } from '../../contexts/User/UserContext';

/**
 * Show either a Login button (if user isn't authenticated)
 * or a welcome message and Logout button.
 */

function Login({ style }: { style: any }, { telescopeUrl }: { telescopeUrl: any }): any {
  const { telescopeUrl: any } = { telescopeUrl }; // useSiteMetadata()
  const user = useContext(UserStateContext);
  const dispatch = useContext(UserDispatchContext);

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

  // Check if using mobile header which means a style prop exists
  if (style) {
    return user && user.email ? (
      <ListItem button component={Link} href={`${telescopeUrl}/auth/logout`} className={style}>
        <LoggedIn />
      </ListItem>
    ) : (
      <ListItem button component={Link} href={`${telescopeUrl}/auth/login`} className={style}>
        <LoggedOut />
      </ListItem>
    );
  }

  return user && user.email ? <LoggedIn /> : <LoggedOut />;
}

Login.propTypes = {
  style: PropTypes.object,
};

export default Login;
