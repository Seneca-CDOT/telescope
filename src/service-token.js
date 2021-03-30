const jwt = require('jsonwebtoken');

const { JWT_ISSUER, JWT_AUDIENCE, SECRET } = process.env;

/**
 * Create a short-lived service-to-service JWT, useful for authorizing
 * one Telescope microservice with another.  The receiving service has
 * to opt into this by allowing the 'service' role.
 * @returns JWT service token
 */
function createServiceToken() {
  const payload = {
    iss: JWT_ISSUER,
    aud: JWT_AUDIENCE,
    sub: 'telescope-service',
    roles: ['service'],
  };

  return jwt.sign(payload, SECRET, { expiresIn: '5m' });
}

module.exports = createServiceToken;
