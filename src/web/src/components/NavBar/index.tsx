import Link from 'next/link';
import { useMemo, CSSProperties } from 'react';
import { AppBar, Toolbar, Tooltip, Zoom } from '@material-ui/core';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import { Transition } from 'react-transition-group';

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
    position: 'fixed',
    top: '1.4em',
    left: '0',
    width: '15em',
    height: 'fit-content',
    transition: `transform 200ms ease-in-out, opacity 200ms ease-in-out`,
    [theme.breakpoints.down(1200)]: {
      left: '-3vw',
    },
    [theme.breakpoints.down(1024)]: {
      left: '0',
      top: 'auto',
      bottom: '0',
      width: '100vw',
    },
  },
  appBar: {
    boxShadow: 'none',
    color: theme.palette.primary.main,
    backgroundColor: 'transparent',
    transition: 'width 100ms linear,top 300ms linear',
    [theme.breakpoints.down(1024)]: {
      transition: 'width 100ms linear,top 100ms cubic-bezier(0.5, 1, 0.89, 1)',
      flexDirection: 'row',
      alignItems: 'center',
      background: theme.palette.background.default,
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
      paddingBottom: 'env(safe-area-inset-bottom, 0)',
    },
  },
  grow: {
    marginTop: '2.5em',
    flex: 1,
  },
  logoIcon: {
    margin: '0 0.5rem',
  },
  avatar: {
    padding: '12px',
  },
}));

const ButtonTooltip = withStyles({
  tooltip: {
    fontSize: '1.5rem',
    margin: 0,
  },
})(Tooltip);

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
  const { user, logout } = useAuth();

  const slideTransition: { [state: string]: CSSProperties } = useMemo(
    () => ({
      entered: { opacity: 1, transform: 'translateY(0)', zIndex: 999 },
      entering: { opacity: 0, transform: `translateY(${desktop ? '-50%' : '50%'})` },
      exited: { opacity: 0, transform: `translateY(${desktop ? '-100%' : '100%'})` },
      exiting: { opacity: 0, transform: `translateY(${desktop ? '-100%' : '100%'})` },
    }),
    [desktop]
  );

  return (
    <Transition in={!disabled} timeout={300} unmountOnExit>
      {(state) => (
        <div style={{ ...slideTransition[state] }} className={classes.root}>
          <AppBar className={classes.appBar} position="static">
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
              {!user && <Login />}
              <DynamicThemeToggleButton />
              {user && (
                <ButtonTooltip title="Logout" arrow placement="top" TransitionComponent={Zoom}>
                  <button type="button" className={classes.avatar} onClick={() => logout()}>
                    <TelescopeAvatar name={user.name} img={user.avatarUrl} size="27px" />
                  </button>
                </ButtonTooltip>
              )}
            </Toolbar>
          </AppBar>
        </div>
      )}
    </Transition>
  );
}
