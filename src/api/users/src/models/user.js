// This is our User "schema" that we use when creating a new user
const { hash } = require('@senecacdot/satellite');

class User {
  constructor(data) {
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.displayName = data.displayName || `${this.firstName} ${this.lastName}`;
    this.isAdmin = data.isAdmin === true;
    this.isFlagged = data.isFlagged === true;
    this.feeds = data.feeds;

    // Legacy users won't have GitHub info
    if (data.github) {
      this.github = data.github;
    }
  }

  get id() {
    // A user's id is the hash of their email, using the Satellite hash() function.
    return hash(this.email);
  }

  toJSON() {
    const data = {
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      displayName: this.displayName,
      isAdmin: this.isAdmin,
      isFlagged: this.isFlagged,
      feeds: this.feeds,
    };

    // Only include github if it's populated
    if (this.github) {
      data.github = this.github;
    }

    return data;
  }
}

// Firestore converter functions for custom class, see:
// https://firebase.google.com/docs/reference/js/firebase.firestore.FirestoreDataConverter
const userConverter = {
  toFirestore(user) {
    return user.toJSON();
  },

  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return new User(data);
  },
};

module.exports.User = User;
module.exports.userConverter = userConverter;
