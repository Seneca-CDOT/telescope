const User = require('./user');
const { hash } = require('@senecacdot/satellite');

// Get space separated list of admin accounts from env
const administrators = process.env.ADMINISTRATORS ? process.env.ADMINISTRATORS.split(' ') : [];

// Admin user
class Admin extends User {
  constructor(name, email, id, nameID, nameIDFormat) {
    super(name, email, id, nameID, nameIDFormat);
    this.isAdmin = true;
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
