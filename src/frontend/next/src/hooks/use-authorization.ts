import useSWR from 'swr';

import config from '../config';
import { User } from '../interfaces';

export default function useAuthorization(): User {
  const loggedOutUser: User = { isLoggedIn: false };

  // Assuming fetch() works, our fetcher function will always
  // return a User object with at least isLoggedIn present.
  const fetcher = async (url: string) => {
    const res = await fetch(url);

    if (!res.ok) {
      // A 403 is common and expected (e.g., when not logged in).
      // For any other error, log a message, and since we don't know
      // what the auth status of the user really is, assume logged out.
      if (res.status !== 403) {
        console.warn(`unexpected authorization error: ${res.status}`);
      }
      return loggedOutUser;
    }

    // If it was 200, get the user info so we can return. In this case
    // a user is logged in.
    const user = await res.json();
    return {
      ...user,
      isLoggedIn: true,
    };
  };

  const { data, error } = useSWR<User>(`${config.telescopeUrl}/user/info`, fetcher);

  // In the error case (backend is down?) we have no idea, so logged out.
  if (error) {
    console.warn(`unexpected authorization error: ${error.message}`);
    return loggedOutUser;
  }

  // If we have user data from the backend, use that
  if (data) {
    return data;
  }

  // In all other cases (e.g., on startup before we hear back from the
  // server, or some other unknown condition), assume logged out.
  return loggedOutUser;
}
