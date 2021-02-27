import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import HeaderButton, { HeaderIcon } from './HeaderButton';

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
    position: 'fixed',
    width: '15em',
    top: '1.4em',
    left: '0',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    color: theme.palette.primary.main,
  },
  toolbar: {
    height: '27rem',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  button: {
    margin: '0 0.5rem',
  },
  grow: {
    flex: 1,
  },
  logoIcon: {
    margin: '0 0.5rem',
  },
}));

const buttons: HeaderIcon[] = [
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

export default function DesktopHeader() {
  const classes = useStyles();

  return (
    <AppBar className={classes.root}>
      <Link href="/" passHref>
        <a className={classes.logoIcon}>
          <Logo height={45} width={45} />
        </a>
      </Link>
      <Toolbar className={classes.toolbar}>
        <div className={classes.grow} />

        {buttons.map((button) => (
          <HeaderButton button={button} key={button.title} />
        ))}

        <Login />
        {/* 1.7 band-aid (Removing theme| line 87) */}
        {/* <DynamicThemeToggleButton /> */}
      </Toolbar>
    </AppBar>
  );
}
