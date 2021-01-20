import useSWR from 'swr';

import config from '../config';
import { User } from '../interfaces';

export default function useAuthorization(loggedOutUser: User): User {
  const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
      // If we get back a 403, return the initial user data (not logged in).
      if (res.status === 403) {
        return loggedOutUser;
      }
      // For any other error, throw so we can retry
      throw new Error(`authorization error: ${res.status}`);
    }
    return res.json();
  };

  const authUrl = `${config.telescopeUrl}/user/info`;
  const { data, error } = useSWR(authUrl, fetcher, { initialData: loggedOutUser });
  const isLoggedIn = data && !error;

  return {
    ...data,
    isLoggedIn,
  };
}
