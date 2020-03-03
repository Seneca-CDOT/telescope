import React, { useState, useEffect } from 'react';
import LoggedIn from './LoggedIn.jsx';
import LoggedOut from './LoggedOut.jsx';
import useSiteMetadata from '../../hooks/use-site-metadata';

/**
 * Show either a Login button (if user isn't authenticated)
 * or a welcome message and Logout button.
 */

function Login() {
  const { telescopeUrl } = useSiteMetadata();
  const [email, setEmail] = useState(null);

  useEffect(() => {
    // Try to get user session info from the server.
    async function getUserInfo() {
      try {
        // See if the server has session info on this user
        const response = await fetch(`${telescopeUrl}/user/info`);

        if (!response.ok) {
          // Not an error, we're just not authenticated
          if (response.status === 401) {
            return;
          }
          throw new Error(response.statusText);
        }

        const user = await response.json();
        if (user && user.email) {
          setEmail(user.email);
        }
      } catch (error) {
        console.error('Error getting user info', error);
      }
    }

    getUserInfo();
  }, [telescopeUrl]);

  return email ? <LoggedIn email={email} /> : <LoggedOut />;
}

export default Login;
