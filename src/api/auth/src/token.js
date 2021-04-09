const jwt = require('jsonwebtoken');
const { hash } = require('@senecacdot/satellite');

const { JWT_ISSUER, JWT_AUDIENCE, SECRET, JWT_EXPIRES_IN } = process.env;

/**
 * Create a JWT token for the user, and add the 'admin' role if requested.
 * @param {string} email the email of this user. This will be the sub claim
 * @param {string} name a name suitable for display for this user.
 * @param {Array<string>} roles an array of roles for this user
 * @param {string} picture [optional] a URL to the user's picture
 * @returns {string} the JWT for this user
 */
function createToken(email, firstName, lastName, name, roles, picture) {
  // The token we create includes a number of claims in the payload, using the
  // recommended claims for OpenID, https://openid.net/specs/openid-connect-basic-1_0.html#StandardClaims
  const payload = {
    // iss claim: the token is issued by us (e.g., this server)
    iss: JWT_ISSUER,
    // aud claim: it is intended for the services running at this api origin
    aud: JWT_AUDIENCE,
    // sub claim: the subject of this token (e.g., their hashed email address)
    sub: hash(email),
    // email claim: the user's email address
    email,
    // given_name claim: the user's given, or first name(s).
    given_name: firstName,
    // family_name: the user's surnames or last name(s).
    family_name: lastName,
    // name claim: the user's full display name
    name,
    // roles claim: an Arry of one or more authorization roles. There are various
    // combinations possible. For authenticated users, we currently have the
    // following, and/ a user will have one or more, depending on their account type:
    //   1. seneca (user was authenticated with Seneca's SSO)
    //   2. telescope (user has a Telescope account with the Users service)
    //   3. admin (user's Telescope account includes isAdmin=true)
    //
    // We also have a service token role, for cases where microservices need to
    // communicate with one another using protected routes:
    //   4. service (a Telescope microservice, see createServiceToken() in Satellite)
    roles,
  };

  // We may or may not have a GitHub Avatar URL to use for the picture
  if (picture) {
    payload.picture = picture;
  }

  const options = { expiresIn: JWT_EXPIRES_IN || '7 days' };
  return jwt.sign(payload, SECRET, options);
}

module.exports.createToken = createToken;
