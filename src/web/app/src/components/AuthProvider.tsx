import { createContext, ReactNode, useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from 'react-use';
import { useRouter } from 'next/router';
import { nanoid } from 'nanoid';
import type { SupabaseClient } from '@supabase/supabase-js';

import supabase from '../supabase';
import User from '../User';
import { loginUrl, logoutUrl, webUrl } from '@config';

export interface AuthContextInterface {
  login: (returnTo?: string) => void;
  logout: () => void;
  register: (token: string) => void;
  user?: User;
  token?: string;
  supabase?: SupabaseClient;
}

const AuthContext = createContext<AuthContextInterface>({
  login() {
    throw new Error('You need to wrap your component in <AuthProvider>');
  },
  logout() {
    throw new Error('You need to wrap your component in <AuthProvider>');
  },
  register() {
    throw new Error('You need to wrap your component in <AuthProvider>');
  },
});

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const router = useRouter();
  const { pathname, asPath } = router;
  const [user, setUser] = useState<User | undefined>();
  const [authState, setAuthState, removeAuthState] = useLocalStorage<string>(
    'auth:state',
    undefined,
    {
      raw: true,
    }
  );
  const [token, setToken, removeToken] = useLocalStorage<string>('auth:token', undefined, {
    raw: true,
  });

  // Mange the user state based on the presence and validity of the token
  useEffect(() => {
    const cleanup = () => {
      removeToken();
      removeAuthState();
      setUser(undefined);
    };

    if (!token) {
      cleanup();
      return;
    }

    try {
      setUser(User.fromToken(token));
    } catch (err) {
      // This token isn't parsable, remove all auth info from storage
      console.error('Error parsing token for user', err);
      cleanup();
    }
  }, [removeAuthState, removeToken, token]);

  const login = useCallback(
    (returnTo?: string) => {
      // Create and store some random state that we'll send along with this login request
      const loginState = nanoid();
      setAuthState(loginState);

      // Set our return URL
      const url = new URL(returnTo || '', webUrl);
      window.location.href = `${loginUrl}?redirect_uri=${url.href}&state=${loginState}`;
    },
    [setAuthState]
  );

  const logout = useCallback(() => {
    // Clear our existing token and state
    removeToken();
    removeAuthState();

    // Redirect to logout
    window.location.href = `${logoutUrl}?redirect_uri=${webUrl}`;
  }, [removeAuthState, removeToken]);

  const register = useCallback(
    (receivedToken: string) => {
      setToken(receivedToken);
    },
    [setToken]
  );

  useEffect(() => {
    // Browser-side rendering
    try {
      // Try to extract access_token and state query params from the URL, which may not be there
      const params = new URL(asPath, document.location.href).searchParams;
      const accessToken = params.get('access_token');
      const state = params.get('state');

      if (!token && accessToken) {
        // Remove the ?access_token=...&state=... from URL
        router.replace(pathname, undefined, { shallow: true });

        // Make sure we initiated the login flow.  When we start the login
        // we store some random state in localStorage.  When we get redirected
        // back with an access token, we should also get our original random state.
        // If we do, all is well.  If not, don't use this token, since it wasn't
        // us who initiated the login.
        if (authState !== state) {
          throw new Error(`login state '${state}' doesn't match expected state '${authState}'`);
        }

        // Override the JWT on the public client
        supabase.auth.setAuth(accessToken);
        // Store this token in localStorage and clear login state
        setToken(accessToken);
        removeAuthState();
      }
    } catch (err) {
      // TODO: should we do more in the error case?  If so, what?
      console.error('Error parsing access_token from URL', err);
    }
  }, [asPath, authState, pathname, removeAuthState, router, setToken, token]);

  // Server-side rendering.
  if (typeof window === 'undefined') {
    return (
      <AuthContext.Provider value={{ login: () => null, logout: () => null, register: () => null }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={{ login, logout, register, user, token, supabase }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
export { AuthContext };
