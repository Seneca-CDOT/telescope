import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';

import useAuth from '../../hooks/use-auth';
import NavBarButton, { NavBarIconProps } from '../NavBar/NavBarButton';

const LoggedIn = () => {
  const { logout, user } = useAuth();

  const iconProps: NavBarIconProps[] = [
    {
      href: '/myfeeds',
      title: 'My Feeds',
      ariaLabel: 'my feeds',
      Icon: AccountCircleIcon,
    },
    {
      title: 'Log Out',
      onClick: () => logout(),
      Icon: PowerSettingsNewIcon,
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <>
      {iconProps.map((props) => (
        <NavBarButton {...props} key={props.title} />
      ))}
    </>
  );
};

export default LoggedIn;
