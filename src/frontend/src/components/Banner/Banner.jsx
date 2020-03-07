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
  fontSize: '8rem',
  // screens under 600px
  [theme.breakpoints.down('xs')]: {
    fontSize: '8rem',
    top: theme.spacing(35),
    left: theme.spacing(3),
  },
  // screens over 600px
  [theme.breakpoints.up('sm')]: {
    fontSize: '10rem',
    top: theme.spacing(35),
    left: theme.spacing(10),
  },
  // screens over 960px
  [theme.breakpoints.up('md')]: {
    fontSize: '12rem',
    top: theme.spacing(32),
    left: theme.spacing(10),
  },
  // screens over 1280px
  [theme.breakpoints.up('lg')]: {
    fontSize: '15rem',
    top: theme.spacing(30),
    left: theme.spacing(10),
  },
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
