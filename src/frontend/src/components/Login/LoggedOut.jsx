import React from 'react';

import useSiteMetadata from '../../hooks/use-site-metadata';
import './Login.css';

function LoggedOut() {
  const { telescopeUrl } = useSiteMetadata();
  const loginUrl = `${telescopeUrl}/auth/login`;

  return (
    <div>
      <a href={loginUrl} className="login-button">
        LOGIN
      </a>
    </div>
  );
}

export default LoggedOut;
