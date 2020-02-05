import React from 'react';
import { navigate } from 'gatsby';
import { handleLogin, isLoggedIn } from '../services/auth';
class Button extends React.Component {
  state = {
    username: ``,
  };

  render() {
    if (!isLoggedIn()) {
      navigate(`/login`);
    }
    return <p>Logged In</p>;
  }
}
export default Login;
