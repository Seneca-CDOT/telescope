/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Login.css';

function LoggedIn(props) {
  return (
    <div>
      Welcome {props.email} <a href="/auth/logout"> Logout </a>
      <img className="avatar" src={`https://unavatar.now.sh/${props.email}`} alt={props.email} />
    </div>
  );
}

function LoggedOut() {
  return (
    <div>
      <a href="/auth/login">Login</a>
    </div>
  );
}

class Login extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      email: null,
    };
  }

  componentDidMount() {
    fetch('../user/info', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw new Error('Error danger will robinson');
      })
      .then(response => response.json())
      .then(user => {
        if (user) {
          this.setState({ email: user.email });
        }
        return true;
      })
      .catch(error => {
        // Handles an error thrown above, as well as network general errors
        console.log(error);
      });
  }

  render() {
    if (this.state.email) {
      return <LoggedIn email={this.state.email} />;
    }
    return <LoggedOut />;
  }
}
LoggedIn.propTypes = {
  email: PropTypes.string,
};

export default Login;
