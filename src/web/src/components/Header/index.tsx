import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

// import MobileHeader from './MobileHeader';
import DesktopHeader from './DesktopHeader';
import MobileHeader from './MobileHeader';

function Header() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down(1024));

  return <>{matches ? <MobileHeader /> : <DesktopHeader />}</>;
}

export default Header;
