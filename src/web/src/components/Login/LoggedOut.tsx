import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import config from '../../config';
import NavBarButton from '../NavBar/NavBarButton';

const LoggedOut = () => {
  const { loginUrl } = config;

  return (
    <NavBarButton
      button={{
        href: loginUrl,
        title: 'Log In',
        ariaLabel: 'log in',
        Icon: ExitToAppIcon,
      }}
    />
  );
};

export default LoggedOut;
