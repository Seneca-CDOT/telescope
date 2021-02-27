import Link from 'next/link';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// import MobileHeader from './MobileHeader';
import { Toolbar } from '@material-ui/core';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';
import Logo from '../Logo';

const useStyles = makeStyles((theme) => ({
  logoIcon: {
    boxShadow: 'none',
    margin: '0px 0.5em',
    position: 'fixed',
    width: '15em',
    top: '1.4em',
    left: '0',
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    zIndex: 400,
  },
}));

function Header() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down(1024));
  const classes = useStyles();

  return (
    <>
      <Toolbar className={classes.logoIcon}>
        <Link href="/" passHref>
          <a>
            <Logo height={45} width={45} />
          </a>
        </Link>
      </Toolbar>
      {matches ? <MobileHeader /> : <DesktopHeader />}
    </>
  );
}

export default Header;
