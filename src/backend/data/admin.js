const Feed = require('./feed');
const User = require('./user');

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
}

module.exports = Admin;
