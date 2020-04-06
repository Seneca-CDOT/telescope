import { useState, useEffect } from 'react';
import useSiteMetadata from '../../hooks/use-site-metadata';

function Login() {
  const { telescopeUrl } = useSiteMetadata();
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);

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
        if (user && user.email && user.name) {
          setEmail(user.email);
          setName(user.name);
        }
      } catch (error) {
        console.error('Error getting user info', error);
      }
    }

    getUserInfo();
  }, [telescopeUrl]);

  return email ? { name } : false;
}

export default Login;
