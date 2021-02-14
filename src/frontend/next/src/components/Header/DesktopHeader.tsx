import Link from 'next/link';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Button, IconButton } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import Logo from '../Logo';
import Login from '../Login';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: 'primary',
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
  links: {
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
          <IconButton color="inherit" className={classes.button} aria-label="search">
            <Link href="/search">
              <SearchIcon className={classes.searchIcon} />
            </Link>
          </IconButton>

          <Button color="inherit" size="medium" className={classes.button}>
            <Link href="/">
              <a className={classes.links}>Home</a>
            </Link>
          </Button>
          <Button color="inherit" size="medium" className={classes.button}>
            <Link href="/about">
              <a className={classes.links}>About</a>
            </Link>
          </Button>
          <Login />
        </Toolbar>
      </AppBar>
    </>
  );
}
