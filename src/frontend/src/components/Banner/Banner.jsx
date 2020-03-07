import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

import Version from '../../../../../package.json';
import './Banner.css';

const theme = createMuiTheme();
theme.typography.h1 = {
  position: 'absolute',
  color: 'white',
  fontFamily: 'Roboto',
  fontWeight: 'bold',
  opacity: 0.85,
  fontSize: '12vw',
  top: theme.spacing(25),
  left: theme.spacing(8),
};

export default function Banner() {
  return (
    <div className="heroBanner">
      <div className="bannerImg"></div>
      <ThemeProvider theme={theme}>
        <Typography variant="h1">{'Telescope'}</Typography>
      </ThemeProvider>
      <div className="version">v {Version.version}</div>
      <div className="icon">
        <Fab color="primary" size="medium" aria-label="scroll-down">
          <ArrowDownwardIcon />
        </Fab>
      </div>
    </div>
  );
}
