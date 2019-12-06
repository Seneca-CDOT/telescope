const saml = require('passport-saml');
require('../lib/config');
const fs = require('fs');
const path = require('path');
const { logger } = require('../utils/logger');
/*
Tutorial is here: https://medium.com/disney-streaming/setup-a-single-sign-on-saml-test-environment-with-docker-and-nodejs-c53fc1a984c9
SAML2_BASE_URI=saml-poc
SAML2_CLIENT_ID=ddf97d-xxx-xxxx-e92920
SAML2_CLIENT_SECRET=f021f63bxxxx71f2c6a90c9b
SAML2_REDIRECT_URI=http://localhost:3000/oauth/callback
*/
let cert = null;

const { SAML2_BASE_URI, SAML2_REDIRECT_URI } = process.env;

try {
  cert = fs.readFileSync(path.resolve(process.cwd(), './certs/key.pem'), 'utf8');
} catch (error) {
  logger.error({ error }, 'Unable to load certs/key.pem');
}

const samlStrategy = new saml.Strategy(
  {
    callbackUrl: SAML2_REDIRECT_URI,
    entryPoint: SAML2_BASE_URI,
    issuer: 'saml-poc',
    identifierFormat: null,
    decryptionPvk: cert,
    privateCert: cert,
  },
  function(profile, done) {
    return done(null, profile);
  }
);

const handleLogin = function(req, res, next) {
  next();
};

module.exports = {
  samlStrategy,
  handleLogin,
};
