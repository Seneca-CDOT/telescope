const Feed = require('./feed');
const User = require('./user');
const hash = require('./hash');

// Get space separated list of admin accounts from env
const administrators = process.env.ADMINISTRATORS ? process.env.ADMINISTRATORS.split(' ') : [];

class Admin extends User {
  constructor(name, email, id) {
    super(name, email, id);
    this.isAdmin = true;
  }

  // An admin owns all feeds
  owns() {
    return true;
  }

  // Return every feed for this user
  feeds() {
    return Feed.all();
  }

  /**
   * We define an administrator as someone who is specified in the .env
   * ADMINISTRATORS variable list. We support bare email addresses and hashed.
   * See env.sample for more details.
   */
  static isAdmin(id) {
    return administrators.some((admin) => id === admin || id === hash(admin));
  }
}

module.exports = Admin;
