// This is our User "schema" that we use when creating a new user

class User {
  constructor(data) {
    this.id = data.id;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.displayName = data.displayName || `${this.firstName} ${this.lastName}`;
    this.isAdmin = data.isAdmin;
    this.isFlagged = data.isFlagged;
    this.feeds = data.feeds;
    this.github = data.github;
  }
}

module.exports = User;
