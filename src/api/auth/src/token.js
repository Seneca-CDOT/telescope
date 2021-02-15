const jwt = require('jsonwebtoken');

const { JWT_ISSUER, JWT_AUDIENCE, SECRET, JWT_EXPIRES_IN } = process.env;

function createToken(subject) {
  // TODO - figure out all the various claims we need to use
  const payload = {
    // The token is issued by us (e.g., this server)
    iss: JWT_ISSUER,
    // It is intended for the services running at this api origin
    aud: JWT_AUDIENCE,
    // The subject of this token, the user
    sub: subject,
    // TODO: role info (e.g., admin)
  };

  const options = { expiresIn: JWT_EXPIRES_IN || '1h' };
  return jwt.sign(payload, SECRET, options);
}

module.exports.createToken = createToken;
