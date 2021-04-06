import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

import useAuth from '../../hooks/use-auth';
import NavBarButton, { NavBarIconProps } from '../NavBar/NavBarButton';

const LoggedIn = () => {
  const { logout, user } = useAuth();

  const iconProps: NavBarIconProps[] = [
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
