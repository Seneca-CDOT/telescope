import { createContext, ReactNode, useContext } from 'react';

import { User, AuthenticatedUser, AdminUser } from '../interfaces';
import useAuthorization from '../hooks/use-authorization';
import config from '../config';

const { loginUrl } = config;
const UserContext = createContext<null | User | AuthenticatedUser | AdminUser>(null);

type Props = {
  children: ReactNode;
};

const UserProvider = ({ children }: Props) => {
  const user = useAuthorization();
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default UserProvider;

/**
 * User Hooks
 * ----------
 *
 * We provide three different user hooks, which work in a similar way,
 * but are meant to be used in different circumstances.
 *
 * useUser() - when all you care about is if the user is logged in or not.
 *
 * useAuthenticatedUser(shouldRedirect) - when you need an authenticated user.
 * You will get null or an AuthenticatedUser in response.  If shouldRedirect
 * is true, it will redirect to the Telescope login page.
 *
 * useAdminUser(shouldRedirect) - when you need an authenticated admin user.
 * You will get null or an AdminUser in response.  If shouldRedirect
 * is true, it will redirect to the Telescope login page.
 */
export const useUser = (): null | User => useContext(UserContext);

export const useAuthenticatedUser = (shouldRedirect = false): null | AuthenticatedUser => {
  const user = useUser();

  // Wait until we have user info from the server
  if (!user) {
    return null;
  }

  if (!user.isLoggedIn) {
    if (shouldRedirect) {
      window.location.href = loginUrl;
    }
    // Caller wants an authenticated user, which we don't have,
    // so return nothing.
    return null;
  }

  // User's authentication status is known, return that
  return user as AuthenticatedUser;
};

export const useAdminUser = (shouldRedirect = false): null | AdminUser => {
  const user = useAuthenticatedUser();

  // Wait until we have user info from the server
  if (!user) {
    return null;
  }

  if (!user.isAdmin) {
    if (shouldRedirect) {
      window.location.href = loginUrl;
    }
    // Caller wants an admin user, which we don't have,
    // so return nothing.
    return null;
  }

  // User's authentication status is known, return that
  return user as AdminUser;
};
