import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import MobileBottomBar from './MobileBottomBar.jsx';

function BottomBar() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down(1440));

  return <>{matches ? <MobileBottomBar /> : null}</>;
}

export default BottomBar;
