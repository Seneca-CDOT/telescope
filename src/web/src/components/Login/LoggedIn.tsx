import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useAuthenticatedUser } from '../UserProvider';
import config from '../../config';
import HeaderButton, { HeaderIcon } from '../Header/HeaderButton';

const LoggedIn = () => {
  const user = useAuthenticatedUser();
  const { logoutUrl } = config;

  const buttons: HeaderIcon[] = [
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
        <HeaderButton button={button} key={button.title} />
      ))}
    </>
  );
};

export default LoggedIn;
