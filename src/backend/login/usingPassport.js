const passport = require('passport');
const OneLoginStrategy = require('passport-openid').Strategy;
require('../lib/config');

/* Set environmental variables for these
https://www.onelogin.com/ to create your account.
Tutorial is here: https://developers.onelogin.com/quickstart/authentication/nodejs
OIDC_BASE_URI=https://openid-connect.onelogin.com/oidc
OIDC_CLIENT_ID=ddf97d-xxx-xxxx-e92920
OIDC_CLIENT_SECRET=f021f63bxxxx71f2c6a90c9b
OIDC_REDIRECT_URI=http://localhost:3000/oauth/callback
*/

// Configure the OpenId Connect Strategy
// with credentials obtained from OneLogin
const { OIDC_BASE_URI, OIDC_CLIENT_ID, OIDC_CLIENT_SECRET, OIDC_REDIRECT_URI } = process.env;

passport.use(
  new OneLoginStrategy(
    {
      issuer: OIDC_BASE_URI,
      clientID: OIDC_CLIENT_ID,
      clientSecret: OIDC_CLIENT_SECRET,
      authorizationURL: `${OIDC_BASE_URI}/auth`,
      userInfoURL: `${OIDC_BASE_URI}/me`,
      tokenURL: `${OIDC_BASE_URI}/token`,
      callbackURL: OIDC_REDIRECT_URI,
      passReqToCallback: true,
    },
    // This function returns 'issuer:' issuer, 'userId:' userId, 'accessToken:' accessToken, 'refreshToken:' refreshToken, 'params:' params
    (req, issuer, userId, profile, accessToken, refreshToken, params, callback) => {
      req.session.accessToken = accessToken;
      return callback(null, profile);
    }
  )
);
