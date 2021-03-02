import Link from 'next/link';
import { AppBar, Toolbar } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import NavBarButton, { NavBarIcon } from './NavBarButton';

// 1.7 band-aid (Removing theme | line 6)
// import dynamic from 'next/dynamic';

import Logo from '../Logo';
import Login from '../Login';

/**  This will solve the problem of incorrect rendering of theme icon when theme preference is dark
 * This ensures that the version displayed to user is the client view which ties to the client's preference theme.
 * This is only an issue on DesktopHeader since on MobileHeader there is a listener triggering rerendering.
 * */
// 1.7 band-aid (Removing theme | line 16 - 18)
// const DynamicThemeToggleButton = dynamic(() => import('../ThemeToggleButton'), {
//   ssr: false,
// });

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
    [theme.breakpoints.down(1024)]: {
      transition: 'width 100ms linear,top 100ms cubic-bezier(0.5, 1, 0.89, 1)',
      top: 'auto',
      bottom: '0',
      width: '100vw',
      flexDirection: 'row',
      alignItems: 'center',
      background: theme.palette.background.default,
    },
  },
  toolbar: {
    height: '27rem',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down(1024)]: {
      height: 'inherit',
      flex: '1',
      justifyContent: 'space-around',
      flexDirection: 'row',
      alignItems: 'center',
    },
  },
  grow: {
    flex: 1,
  },
  logoIcon: {
    margin: '0 0.5rem',
  },
}));

const buttons: NavBarIcon[] = [
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

export default function NavBar() {
  const classes = useStyles();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up(1024));

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

        {buttons.map((button) => (
          <NavBarButton button={button} key={button.title} />
        ))}

        <Login />
        {/* 1.7 band-aid (Removing theme| line 87) */}
        {/* <DynamicThemeToggleButton /> */}
      </Toolbar>
    </AppBar>
  );
}
