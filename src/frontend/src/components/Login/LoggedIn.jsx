import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Box } from '@material-ui/core';
import { Link } from 'gatsby';

import useSiteMetadata from '../../hooks/use-site-metadata';

const useStyles = makeStyles({
  button: {
    float: 'right',
    margin: '0 0.5rem 0 0.5rem',
  },
  link: {
    textDecoration: 'none',
    fontSize: '1.5rem',
    color: 'white',
    lineHeight: 1,
  },
  item: {
    color: 'white',
    fontFamily: 'Roboto, sans-serif',
    textDecoration: 'none',
    fontSize: '1.5rem',
    justifyContent: 'center',
    fontWeight: 500,
    lineHeight: 1.75,
    textTransform: 'uppercase',
  },
});

function LoggedIn(props) {
  const { telescopeUrl } = useSiteMetadata();
  const logoutUrl = `${telescopeUrl}/auth/logout`;
  const classes = useStyles();

  return (
    <div>
      <Box component="div" display="inline">
        <Button className={classes.button}>
          <a href={logoutUrl} className={classes.link}>
            Logout
          </a>
        </Button>
      </Box>
      <Box component="div" display="inline">
        <Link to="/myfeeds" className={classes.item}>
          {props.name}
        </Link>
      </Box>
    </div>
  );
}

LoggedIn.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
};

export default LoggedIn;
