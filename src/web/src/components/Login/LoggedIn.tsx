import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useAuthenticatedUser } from '../UserProvider';
import config from '../../config';
import NavBarButton, { NavBarIcon } from '../NavBar/NavBarButton';

const LoggedIn = () => {
  const user = useAuthenticatedUser();
  const { logoutUrl } = config;

  const buttons: NavBarIcon[] = [
    {
      href: '/myfeeds',
      title: 'My Feeds',
      ariaLabel: 'my feeds',
      Icon: AccountCircleIcon,
    },
    {
      href: logoutUrl,
      title: 'Log Out',
      ariaLabel: 'log out',
      Icon: PowerSettingsNewIcon,
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <>
      {buttons.map((button) => (
        <NavBarButton button={button} key={button.title} />
      ))}
    </>
  );
};

export default LoggedIn;
