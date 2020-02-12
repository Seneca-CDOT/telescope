import React from 'react';
import PropTypes from 'prop-types';

import useSiteMetadata from '../../hooks/use-site-metadata';

function LoggedIn(props) {
  const { telescopeUrl } = useSiteMetadata();
  const logoutUrl = `${telescopeUrl}/auth/logout`;

  return (
    <div>
      Welcome {props.email} <a href={logoutUrl}> Logout </a>
      <img className="avatar" src={`https://unavatar.now.sh/${props.email}`} alt={props.email} />
    </div>
  );
}

LoggedIn.propTypes = {
  email: PropTypes.string,
};

export default LoggedIn;
