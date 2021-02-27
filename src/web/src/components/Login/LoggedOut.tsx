import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import config from '../../config';
import HeaderButton from '../Header/HeaderButton';

const LoggedOut = () => {
  const { loginUrl } = config;

  return (
    <HeaderButton
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
