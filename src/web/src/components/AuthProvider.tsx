import { createContext, ReactNode } from 'react';
import { useLocalStorage } from 'react-use';
import { useRouter } from 'next/router';

import User from '../User';

// TODO: do this via config...
const apiUrl = `http://api.telescope.localhost/v1/auth`;

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
    // Try to extract an access_token query param from the URL, which may not be there
    const params = new URL(asPath, document.location.href).searchParams;
    const accessToken = params.get('access_token');
    if (!token && accessToken) {
      // Remove the ?access_token=... from URL
      router.replace(pathname, undefined, { shallow: true });
      // TODO: check state with what we have
      // Store this token in localStorage
      setToken(accessToken);
    }
  } catch (err) {
    // TODO: should we do more in the error case?  If so, what?
    console.error('Error parsing access_token from URL', err);
  }

  // If we have a token, see if we can extract user info from it
  let user: User | undefined;
  if (token) {
    try {
      user = User.fromToken(token);
    } catch (err) {
      // This token isn't ok, remove it from storage
      removeToken();
      console.error('Error parsing token for user', err);
    }
  }

  const login = (returnTo?: string) => {
    window.location.href = `${apiUrl}/login?redirect_uri=${encodeURIComponent(
      returnTo || window.location.href
    )}`;
  };

  const logout = (returnTo?: string) => {
    removeToken();
    window.location.href = `${apiUrl}/logout?redirect_uri=${encodeURIComponent(
      returnTo || window.location.href
    )}`;
  };

  return (
    <AuthContext.Provider value={{ login, logout, user, token }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
export { AuthContext };
