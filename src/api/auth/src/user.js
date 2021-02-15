// Regular (non-admin) User
class User {
  constructor(name, email, id, nameID, nameIDFormat) {
    this.name = name;
    this.email = email;
    this.id = id;
    this.nameID = nameID;
    this.nameIDFormat = nameIDFormat;
    this.isAdmin = false;
  }

  toJSON() {
    return {
      name: this.name,
      email: this.email,
      id: this.id,
      nameID: this.nameID,
      nameIDFormat: this.nameIDFormat,
      isAdmin: this.isAdmin,
    };
  }
}

module.exports = User;
