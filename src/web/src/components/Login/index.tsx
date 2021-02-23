import LoggedIn from './LoggedIn';
import LoggedOut from './LoggedOut';
import { useUser } from '../UserProvider';

/**
 * Show either a Login button (if user isn't authenticated)
 * or a welcome message and Logout button.
 */

const Login = () => {
  const user = useUser();

  return user?.isLoggedIn ? <LoggedIn /> : <LoggedOut />;
};

export default Login;
