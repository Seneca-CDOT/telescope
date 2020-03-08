# Login

## Overview

Telescope uses a cookie based, single sign on (SSO) authentication flow. You can
find an excellent high-level overview of how this works in the
[Single-Page App Authentication Using Cookies](https://auth0.com/docs/login/spa/authenticate-with-cookies) article.

The general idea is that users click a "login" link in Telescope, and are
redirected to an identify provider, where they enter username and password.
The identity provider sets cookies in the browser if the login is successful,
and the user is redirected back to Telescope. At this point, the Telescope
backend can check for user information via cookies, and allow or deny access
to certain features, pages, or routes.

In our backend server, we use the [Passport](http://www.passportjs.org/) node
authentication middleware with a [SAML2 Passport authentication strategy](https://github.com/bergie/passport-saml).

In our frontend app, we use [Gatsby techniques like client-only routes](https://www.gatsbyjs.org/tutorial/authentication-tutorial/),
and communicate with the backend server to get logged-in user information.

## Using Passport

If you need to secure a route in our backed Express web server, you can
take advantage of the existing SAML Passport setup. For example, to deny
unauthenticated access to a page at a particular route, you can do the following:

```js
// You'll need access to passport
const passport = require('passport');

// Use the passport.authenticate() middleware, using 'saml' as the strategy
router.use('/secure/route', passport.authenticate('saml'), (req, res) => {
  // Only authenticated users can get here.  The `user` info
  // is available on the req Object.
  const user = req.user;
});
```

If you need to protect an HTTP REST API route, use the `protect` middleware
from `src/backend/web/authentication.js`.

## Running an SSO Identity Provider

We use a test SAML SSO provider via a [docker image](kristophjunge/test-saml-idp).
You can [read more about how it works here](https://medium.com/disney-streaming/setup-a-single-sign-on-saml-test-environment-with-docker-and-nodejs-c53fc1a984c9).

### Setup

To get this to run locally, you need to create three `.pem` files:

1. a private key for localhost
1. a public certificate for localhost
1. a public key for the test SAML provider

For good background on what each of these are, see [this explanation](https://www.digitalocean.com/community/tutorials/openssl-essentials-working-with-ssl-certificates-private-keys-and-csrs).

From the root of the project, follow these steps:

```bash
$ mkdir certs
$ cd certs
$ ../tools/generate-ssl-certs.sh
Generating a 4096 bit RSA private key
..................................................................................................................................................................................................++
......................................................................................................................................................................................................++
writing new private key to 'privkey.pem'
-----
```

You will now have the following three files:

1. `certs/cert.pem` your public certificate
1. `certs/privkey.pem` your private key
1. `certs/idp_pubkey.pem` the public key for the Dockerized SSO Identify Provider

### Environment Variables

With the necessary `.pem` files created, update your `.env` file (copy `env.example`
if you don't have one) to ensure all related SAML2 SSO variables are defined.
You need the following to be set:

```ini
# The Single Sign On (SSO) login service URL
SSO_LOGIN_URL=http://localhost:8080/simplesaml/saml2/idp/SSOService.php

# The callback URL endpoint to be used by the SSO login service (see the /auth route)
SSO_LOGIN_CALLBACK_URL=http://localhost:3000/auth/login/callback

# The Single Logout (SLO) service URL
SLO_LOGOUT_URL=http://localhost:8080/simplesaml/saml2/idp/SingleLogoutService.php

# The callback URL endpoint to be used by the SLO logout service (see the /auth route)
SLO_LOGOUT_CALLBACK_URL=http://localhost:3000/auth/logout/callback

# SAML2_CLIENT_ID = CLIENT ID obtained from SAML Strategy default
SAML2_CLIENT_ID=telescope

# SAML2_CLIENT_SECRET = CLIENT SECRET obtained from SAML Strategy, default : secret;
SAML2_CLIENT_SECRET=secret
```

### Running the SSO Identify Provider

Start the backend apps using `docker-compose up –build`. This will build the SAML2 server that is being used as a local service for testing purposes, and Telescope (express). From there, you should be able to click on the login button at `http://localhost:3000/` that will redirect you to the proper login page.

## SSO Fake user Accounts

The test SSO server uses the following fake user accounts:

| Username | Password  |
| -------- | --------- |
| user1    | user1pass |
| user2    | user2pass |
