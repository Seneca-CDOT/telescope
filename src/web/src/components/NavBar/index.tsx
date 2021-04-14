import Link from 'next/link';
import { AppBar, Toolbar } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';

import dynamic from 'next/dynamic';

import NavBarButton, { NavBarIconProps } from './NavBarButton';
import Logo from '../Logo';
import Login from '../Login';
import TelescopeAvatar from '../TelescopeAvatar';
import useAuth from '../../hooks/use-auth';

/**  This will solve the problem of incorrect rendering of theme icon when theme preference is dark
 * This ensures that the version displayed to user is the client view which ties to the client's preference theme.
 * This is only an issue on DesktopHeader since on MobileHeader there is a listener triggering rerendering.
 * */
const DynamicThemeToggleButton = dynamic(() => import('../ThemeToggleButton'), {
  ssr: false,
});

const useStyles = makeStyles((theme) => ({
  root: {
    overflow: 'hidden',
    top: '1.4em',
    left: '0',
    width: '15em',
    boxShadow: 'none',
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
    transition: 'width 100ms linear,top 300ms linear',
    animation: `$navbar 400ms`,
    [theme.breakpoints.down(1200)]: {
      left: '-3vw',
    },
    [theme.breakpoints.down(1024)]: {
      transition: 'width 100ms linear,top 100ms cubic-bezier(0.5, 1, 0.89, 1)',
      top: 'auto',
      bottom: '0',
      width: 'auto',
      flexDirection: 'row',
      alignItems: 'center',
      background: theme.palette.background.default,
      animation: `$mobileNavbar 400ms`,
    },
  },
  '@keyframes navbar': {
    '0%': {
      opacity: 0,
      transform: 'translateY(-200%)',
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  '@keyframes mobileNavbar': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
  toolbar: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down(1024)]: {
      flex: '1',
      justifyContent: 'space-around',
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  grow: {
    marginTop: '2.5em',
    flex: 1,
  },
  logoIcon: {
    margin: '0 0.5rem',
  },
}));

const iconProps: NavBarIconProps[] = [
  {
    href: '/search',
    title: 'Search',
    ariaLabel: 'search',
    Icon: SearchIcon,
  },
  {
    href: '/',
    title: 'Home',
    ariaLabel: 'home',
    Icon: HomeIcon,
  },
  {
    href: '/about',
    title: 'About',
    ariaLabel: 'about',
    Icon: ContactSupportIcon,
  },
];

type NavBarProps = {
  disabled?: boolean;
};

export default function NavBar({ disabled }: NavBarProps) {
  const classes = useStyles();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up(1024));
  const { user } = useAuth();

  if (disabled) {
    return null;
  }
  return (
    <AppBar className={classes.root} position="fixed">
      <Toolbar className={classes.toolbar}>
        {desktop && (
          <>
            <Link href="/" passHref>
              <a className={classes.logoIcon}>
                <Logo height={45} width={45} />
              </a>
            </Link>
            <div className={classes.grow} />
          </>
        )}

        {iconProps.map((props) => (
          <NavBarButton {...props} key={props.title} />
        ))}
        <Login />
        <DynamicThemeToggleButton />
        {user && <TelescopeAvatar name={user.name} img={user.avatarUrl} size="30" />}
      </Toolbar>
    </AppBar>
  );
}
