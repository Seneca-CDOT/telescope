const Feed = require('./feed.js');

class User {
  constructor(name, email, id) {
    this.name = name;
    this.email = email;
    this.id = id;
  }

  toJSON() {
    return {
      name: this.name,
      email: this.email,
      id: this.id,
    };
  }

  owns(feed) {
    return feed.user === this.id;
  }

  async feeds() {
    const feeds = await Feed.all();
    return feeds.filter((feed) => {
      return this.owns(feed);
    });
  }
}

module.exports = User;
