import React from 'react';

import useSiteMetadata from '../../hooks/use-site-metadata';

function LoggedOut() {
  const { telescopeUrl } = useSiteMetadata();
  const loginUrl = `${telescopeUrl}/auth/login`;

  return (
    <div>
      <a href={loginUrl}>Login</a>
    </div>
  );
}

export default LoggedOut;
