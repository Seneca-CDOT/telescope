import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import Logo from '../Logo';
import Login from '../Login';
import ThemeToggleButton from '../ThemeToggleButton';

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
          <ThemeToggleButton />
        </Toolbar>
      </AppBar>
    </>
  );
}
