import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import MobileHeader from './MobileHeader.jsx';
import DesktopHeader from './DesktopHeader.jsx';

function Header() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      {matches ? <MobileHeader/> : <DesktopHeader/>}
    </>
  );
}

export default Header;
