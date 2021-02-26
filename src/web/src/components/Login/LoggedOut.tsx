import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import NavBarButton from '../NavBar/NavBarButton';
import useAuth from '../../hooks/use-auth';

const LoggedOut = () => {
  const { login } = useAuth();
  return <NavBarButton title="Log In" onClick={() => login()} Icon={ExitToAppIcon} />;
};

export default LoggedOut;
