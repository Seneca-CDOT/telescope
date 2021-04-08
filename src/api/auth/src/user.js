const { hash } = require('@senecacdot/satellite');

// A User represents a Seneca SSO Authenticated user who might also be a Telescope user.
class User {
  constructor(senecaProfile, telescopeProfile) {
    // All authenticated users are Seneca Users
    this.seneca = {
      // first name
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname':
        senecaProfile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
      // last name
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname':
        senecaProfile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'],
      // display name
      'http://schemas.microsoft.com/identity/claims/displayname':
        senecaProfile['http://schemas.microsoft.com/identity/claims/displayname'],
      // email address
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress':
        senecaProfile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      nameID: senecaProfile.nameID,
      nameIDFormat: senecaProfile.nameIDFormat,
    };

    // But not all users are Telescope Users (yet) if they haven't signed up.
    if (telescopeProfile) {
      this.telescope = telescopeProfile;
    }
  }

  // The User service uses the first 10 characters of the user's email address
  // hashed with sha256, which the Satellite hash() function does for us.
  get id() {
    return hash(this.email);
  }

  // Normalize access to Standard Seneca user properties and optional Telescope properties
  get email() {
    return this.seneca['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
  }

  get nameID() {
    return this.seneca.nameID;
  }

  get nameIDFormat() {
    return this.seneca.nameIDFormat;
  }

  get firstName() {
    return (
      this.telescope?.firstName ||
      this.seneca['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname']
    );
  }

  get lastName() {
    return (
      this.telescope?.lastName ||
      this.seneca['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname']
    );
  }

  get isAdmin() {
    return !!(this.telescope && this.telescope.isAdmin === true);
  }

  get isFlagged() {
    return !!(this.telescope && this.telescope.isFlagged === true);
  }

  // Prefer Telescope Display Name if set, but fallback to Seneca's
  get displayName() {
    return (
      this.telescope?.displayName ||
      this.seneca['http://schemas.microsoft.com/identity/claims/displayname']
    );
  }

  get feeds() {
    return this.telescope?.feeds;
  }

  get github() {
    return this.telescope?.github;
  }

  // Convenience method for getting the GitHub Avatar URL (if present)
  get avatarUrl() {
    return this.github?.avatarUrl;
  }

  get isTelescopeUser() {
    return !!this.telescope;
  }

  // Get a list of roles for this user
  get roles() {
    const roles = ['seneca'];
    if (this.telescope) {
      roles.push('telescope');
      if (this.telescope.isAdmin === true) {
        roles.push('admin');
      }
    }
    return roles;
  }

  // Serialize the user data into the two main parts
  toJSON() {
    const data = { seneca: this.seneca };
    if (this.telescope) {
      data.telescope = this.telescope;
    }
    return data;
  }

  // Parse a serialized user back into one with segmented Seneca/Telescope parts
  static parse(data) {
    return new User(data.seneca, data.telescope);
  }
}

module.exports = User;
