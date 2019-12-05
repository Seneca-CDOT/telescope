const saml = require('passport-saml');
require('../lib/config');
const fs = require('fs');
const path = require('path');

/*
Tutorial is here: https://medium.com/disney-streaming/setup-a-single-sign-on-saml-test-environment-with-docker-and-nodejs-c53fc1a984c9
SAML2_BASE_URI=https://openid-connect.onelogin.com/oidc
SAML2_CLIENT_ID=ddf97d-xxx-xxxx-e92920
SAML2_CLIENT_SECRET=f021f63bxxxx71f2c6a90c9b
SAML2_REDIRECT_URI=http://localhost:3000/oauth/callback
*/

const { SAML2_BASE_URI, SAML2_REDIRECT_URI } = process.env;

const samlStrategy = new saml.Strategy(
  {
    callbackUrl: SAML2_REDIRECT_URI,
    entryPoint: SAML2_BASE_URI,
    issuer: 'saml-poc',
    identifierFormat: null,
    decryptionPvk: fs.readFileSync(path.join(__dirname, '/certs/certskey.pem'), 'utf8'),
    privateCert: fs.readFileSync(path.join(__dirname, '/certs/certskey.pem'), 'utf8'),
  },
  function(profile, done) {
    return done(null, profile);
  }
);

// Configure the Saml Strategy
// with credentials obtained from Saml2 Docker
// eslint-disable-next-line no-unused-expressions
// eslint-disable-next-line no-sequences
module.exports = {
  samlStrategy,
};
