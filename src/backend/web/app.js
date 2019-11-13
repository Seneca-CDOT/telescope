const express = require('express');
const healthcheck = require('express-healthcheck');

const router = require('./routes');

const app = express();

app.use('/health', healthcheck());

app.use('/', router);

// Initiates an authentication request with OneLogin
// The user will be redirect to OneLogin and once authenticated
// they will be returned to the callback handler below
app.get('/login', passport.authenticate('openidconnect', {
    successReturnToOrRedirect: "/",
    scope: 'profile'
  }));

// Callback handler that OneLogin will redirect back to
// after successfully authenticating the user
app.get('/oauth/callback', passport.authenticate('openidconnect', {
    callback: true,
    successReturnToOrRedirect: '/users',
    failureRedirect: '/'
  }));


  app.get('/logout', function(req, res){
    request.post(`https://openid-connect.onelogin.com/oidc/token/revocation`, {
      'form':{
        'client_id': process.env.OIDC_CLIENT_ID,
        'client_secret': process.env.OIDC_CLIENT_SECRET,
        'token': req.session.accessToken,
        'token_type_hint': 'access_token'
      }
    },function(err, response, body){
      console.log('Session Revoked at OneLogin');
      res.redirect('/');
    });
  });

module.exports = app;
