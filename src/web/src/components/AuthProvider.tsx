import { createContext, ReactNode } from 'react';
import { useLocalStorage } from 'react-use';
import { useRouter } from 'next/router';
import { nanoid } from 'nanoid';

import User from '../User';
import { loginUrl, logoutUrl } from '../config';

export interface AuthContextInterface {
  login: (returnTo?: string) => void;
  logout: (returnTo?: string) => void;
  user?: User;
  token?: string;
}

const AuthContext = createContext<AuthContextInterface>({
  login() {
    throw new Error('You need to wrap your component in <AuthProvider>');
  },
  logout() {
    throw new Error('You need to wrap your component in <AuthProvider>');
  },
});

type Props = {
  children: ReactNode;
};

const AuthProvider = ({ children }: Props) => {
  const router = useRouter();
  const { pathname, asPath } = router;
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

  // Server-side rendering.
  if (typeof window === 'undefined') {
    return (
      <AuthContext.Provider value={{ login: () => null, logout: () => null }}>
        {children}
      </AuthContext.Provider>
    );
  }

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

      // Store this token in localStorage and clear login state
      setToken(accessToken);
      removeAuthState();
    }
  } catch (err) {
    // TODO: should we do more in the error case?  If so, what?
    console.error('Error parsing access_token from URL', err.message);
  }

  // If we have a token, see if we can extract user info from it
  let user: User | undefined;
  if (token) {
    try {
      user = User.fromToken(token);
    } catch (err) {
      // This token isn't ok, remove all auth info from storage
      removeToken();
      removeAuthState();

      console.error('Error parsing token for user', err);
    }
  }

  const login = (returnTo?: string) => {
    // Create and store some random state that we'll send along with this login request
    const loginState = nanoid();
    setAuthState(loginState);

    // Set our return URL
    const redirectUri = encodeURIComponent(returnTo || window.location.href);
    window.location.href = `${loginUrl}?redirect_uri=${redirectUri}&state=${loginState}`;
  };

  const logout = (returnTo?: string) => {
    // Clear our existing token and state
    removeToken();
    removeAuthState();

    // Set our return URL
    const redirectUri = encodeURIComponent(returnTo || window.location.href);
    window.location.href = `${logoutUrl}?redirect_uri=${redirectUri}`;
  };

  return (
    <AuthContext.Provider value={{ login, logout, user, token }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
export { AuthContext };
