import { makeStyles } from '@material-ui/core/styles';
import useSWR from 'swr';
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { dependencyDiscoveryUrl } from '@config';
import DependenciesTable from './DependenciesTable';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    fontFamily: 'Spartan',
    padding: '1em 0 2em 0',
    paddingTop: 'env(safe-area-inset-top)',
    wordWrap: 'break-word',
    [theme.breakpoints.down(1024)]: {
      maxWidth: 'none',
    },
    '& h1': {
      color: theme.palette.text.secondary,
      fontSize: 24,
      transition: 'color 1s',
      marginTop: 0,
    },
    '& p, blockquote': {
      color: theme.palette.text.primary,
      fontSize: 16,
      margin: 0,
    },
  },
  container: {
    padding: '2vh 18vw',
    [theme.breakpoints.down(1024)]: {
      padding: '2vh 8vw',
      wordWrap: 'break-word',
    },
  },
  textCollapsed: {
    display: '-webkit-box',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxHeight: '6rem',
    lineHeight: '3rem',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
  textOpened: {
    lineHeight: '3rem',
  },
  colorButton: {
    color: theme.palette.text.primary,
  },
  buttonWrapper: {
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'end',
  },
}));

const DependenciesPage = () => {
  const classes = useStyles();
  const { data: dependencies = [] } = useSWR(`${dependencyDiscoveryUrl}/projects`);
  const [open, setOpen] = useState(false);

  const toggleCollapse = () => {
    setOpen(!open);
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <h1>Dependencies</h1>
        <div>
          <p className={open ? classes.textOpened : classes.textCollapsed}>
            Telescope is an open source project, built with other open source projects. We use more
            than 1,000 libraries, frameworks, tools and other projects, and each one has
            opportunities for you to contribute fixes, features, documentation, translations, and
            tests. Find your next Issue in the list below, or search for something familiar. Help
            improve Telescope by working on the many upstream projects we depend upon!
          </p>
          <div className={classes.buttonWrapper}>
            <IconButton aria-label="expand row" size="large" onClick={() => toggleCollapse()}>
              {open ? (
                <div className={classes.colorButton}>
                  <span>Show less</span>
                  <KeyboardArrowUpIcon />
                </div>
              ) : (
                <div className={classes.colorButton}>
                  <span>Show more</span>
                  <KeyboardArrowDownIcon />
                </div>
              )}
            </IconButton>
          </div>
        </div>
        <DependenciesTable dependencies={dependencies} />
      </div>
    </div>
  );
};

export default DependenciesPage;
