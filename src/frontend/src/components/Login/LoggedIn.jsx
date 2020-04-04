import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Typography } from '@material-ui/core';
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
  },
  avatar: {
    height: '1em',
  },
});

function LoggedIn(props) {
  const { telescopeUrl } = useSiteMetadata();
  const logoutUrl = `${telescopeUrl}/auth/logout`;
  const classes = useStyles();

  return (
    <div>
      <Button className={classes.button}>
        <a href={logoutUrl} className={classes.link}>
          Logout
        </a>
      </Button>
      <Link to="/myfeeds" className={classes.links}>
        <Typography variant="h4">| {props.name}</Typography>
      </Link>
      <img
        className={classes.avatar}
        src={`https://unavatar.now.sh/${props.name}`}
        alt={props.email}
      />
    </div>
  );
}

LoggedIn.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
};

export default LoggedIn;
