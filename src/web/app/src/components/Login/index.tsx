import LoggedIn from './LoggedIn';
import LoggedOut from './LoggedOut';
import useAuth from '../../hooks/use-auth';

/**
 * Show either a Login button (if user isn't authenticated)
 * or a welcome message and Logout button.
 */
const Login = () => {
  const { user } = useAuth();

  return user ? <LoggedIn /> : <LoggedOut />;
};

export default Login;
