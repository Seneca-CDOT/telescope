const { hash } = require('@senecacdot/satellite');

const roles = require('./roles');

// Support special Telescope "super user" accounts that we can bootstrap from
// the env. The admins are space separated list of admin accounts from env
const telescopeAdmins = process.env.ADMINISTRATORS ? process.env.ADMINISTRATORS.split(' ') : [];
const isSuperUser = (email) => telescopeAdmins.includes(email);

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
    return !!(this.telescope && this.telescope.isAdmin === true) || isSuperUser(this.email);
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
    if (this.telescope) {
      if (this.isAdmin) {
        return roles.admin();
      }
      return roles.telescope();
    }

    // Special case for super users defined via ADMINISTRATORS env variable
    if (this.isAdmin) {
      return roles.superUser();
    }

    // Default to only Seneca
    return roles.seneca();
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
