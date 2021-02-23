import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';

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
    alignItems: 'center',
  },
  grow: {
    flex: 1,
  },
  logoIcon: {
    margin: '0 0.5rem 0 0.5rem',
  },
  icon: {
    fontSize: '2.5rem',
  },
  button: {
    margin: '0 0.5rem 0 0.5rem',
  },
}));

export default function DesktopHeader() {
  const classes = useStyles();

  return (
    <>
      <AppBar className={classes.root}>
        <Toolbar className={classes.toolbar}>
          <Link href="/" passHref>
            <a className={classes.logoIcon}>
              <Logo height={45} width={45} />
            </a>
          </Link>

          <div className={classes.grow} />

          <Link href="/search" passHref>
            <IconButton
              color="inherit"
              className={classes.button}
              aria-label="search"
              component="a"
            >
              <SearchIcon className={classes.icon} />
            </IconButton>
          </Link>

          <Link href="/" passHref>
            <IconButton color="inherit" className={classes.button} aria-label="home" component="a">
              <HomeIcon className={classes.icon} />
            </IconButton>
          </Link>

          <Link href="/about" passHref>
            <IconButton color="inherit" className={classes.button} aria-label="about" component="a">
              <ContactSupportIcon className={classes.icon} />
            </IconButton>
          </Link>

          <Login />
          {/* 1.7 band-aid (Removing theme| line 87) */}
          {/* <DynamicThemeToggleButton /> */}
        </Toolbar>
      </AppBar>
    </>
  );
}
