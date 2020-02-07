/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { isLoggedIn, loginUser, getUser } from '../services/auth';

class Profile extends Component {
  // Initialize the state
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }

  clickMe() {
    window.location.replace('/auth/login');
  }

  componentDidMount() {
    this.setState({ user: getUser() });
    try {
      loginUser();
    } catch (Exception) {
      console.log(Exception);
    }
  }

  render() {
    return (
      <div>
        {isLoggedIn() ? (
          <div style={{ backgroundColor: 'white' }}>
            <li style={{ fontSize: '24px;' }}>E-mail: {this.state.user.email}</li>
          </div>
        ) : (
          <button type="button" onClick={this.clickMe}>
            Login
          </button>
        )}
      </div>
    );
  }
}

export default Profile;
