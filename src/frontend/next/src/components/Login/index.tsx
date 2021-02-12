import LoggedIn from './LoggedIn';
import LoggedOut from './LoggedOut';
import { useUser } from '../UserProvider';

/**
 * Show either a Login button (if user isn't authenticated)
 * or a welcome message and Logout button.
 */

type LoginProps = {
  isMobile?: boolean;
};

const Login = ({ isMobile = false }: LoginProps) => {
  const user = useUser();

  if (isMobile) {
    return user?.isLoggedIn ? <LoggedIn isMobile /> : <LoggedOut isMobile />;
  }

  return user?.isLoggedIn ? <LoggedIn /> : <LoggedOut />;
};

export default Login;
