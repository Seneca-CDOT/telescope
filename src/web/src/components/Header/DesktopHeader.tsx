import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
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
    flexGrow: 1,
    backgroundColor: theme.palette.primary.main,
    justifyContent: 'center',
    height: '7.8em',
  },
  toolbar: theme.mixins.toolbar,
  logoIcon: {
    margin: '0 0.5rem 0 0.5rem',
  },
  grow: {
    flexGrow: 1,
  },
  searchIcon: {
    fontSize: '2.5rem',
    color: theme.palette.primary.contrastText,
  },
  button: {
    float: 'right',
    margin: '0 0.5rem 0 0.5rem',
  },
  buttonText: {
    color: theme.palette.primary.contrastText,
    fontFamily: 'Roboto, sans-serif',
    textDecoration: 'none',
    fontSize: '1.5rem',
    margin: '0 0.5rem 0 0.5rem',
  },
}));

export default function DesktopHeader() {
  const classes = useStyles();
  return (
    <>
      <AppBar position="sticky" className={classes.root}>
        <Toolbar>
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
              <SearchIcon className={classes.searchIcon} />
            </IconButton>
          </Link>

          <Link href="/" passHref>
            <Button color="inherit" size="medium" className={classes.button} component="a">
              <p className={classes.buttonText}>Home</p>
            </Button>
          </Link>
          <Link href="/about" passHref>
            <Button color="inherit" size="medium" className={classes.button} component="a">
              <p className={classes.buttonText}>About</p>
            </Button>
          </Link>
          <Login />
          {/* 1.7 band-aid (Removing theme| line 87) */}
          {/* <DynamicThemeToggleButton /> */}
        </Toolbar>
      </AppBar>
    </>
  );
}
