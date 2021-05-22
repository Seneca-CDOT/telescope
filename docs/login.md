# Login

## Overview

Telescope uses a cookie based, single sign on (SSO) authentication flow. You can
find an excellent high-level overview of how this works in the
[Single-Page App Authentication Using Cookies](https://auth0.com/docs/sessions/cookies/spa-authenticate-with-cookies) article.

The general idea is that users click a "login" link in Telescope, and are
redirected to an identify provider, where they enter username and password.
The identity provider sets cookies in the browser if the login is successful,
and the user is redirected back to Telescope. At this point, the Telescope
backend can check for user information via cookies, and allow or deny access
to certain features, pages, or routes.

In our backend server, we use the [Passport](http://www.passportjs.org/) node
authentication middleware with a [SAML2 Passport authentication strategy](https://github.com/bergie/passport-saml).

In our frontend app, we use [Next.js routes](https://nextjs.org/docs/api-reference/next/router),
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

If you need to protect an HTTP REST API route, use the `protect` (regular
users) or `protectAdmin` (admin users) middleware from `src/backend/web/authentication.js`.

## Running an SSO Identity Provider

We use a test SAML SSO provider via a [docker image](kristophjunge/test-saml-idp).
You can [read more about how it works here](https://medium.com/disney-streaming/setup-a-single-sign-on-saml-test-environment-with-docker-and-nodejs-c53fc1a984c9).

To get this to run locally, you need to update your `.env`. Copy `env.example` if you don't have one, and the default values should work.

4. Start the backend apps using `docker-compose up –build`. This will build the SAML2 server that is being used as a local service for testing purposes, and Telescope (express). From there, you should be able to click on the login button at `http://localhost:3000/` that will redirect you to the proper login page.

**Note**: If running Elasticsearch or Redis natively, please avoid using `docker-compose up -build` and instead use `docker-compose up login` to start the SAML2 server for testing. This will avoid any issues with duplicate services of Redis and Elasticsearch started by `docker-compose up -build`.

5. The test SSO server uses the following fake user accounts defined in [simplesamlphp-users.php](../simplesamlphp-users.php):

| Username    | Password  | Name            | Email                      |
| ----------- | --------- | --------------- | -------------------------- |
| user1       | user1pass | Johannes Kepler | user1@example.com          |
| user2       | user2pass | Galileo Galilei | user2@example.com          |
| LippersheyH | telescope | Hans Lippershey | HansLippershey@example.com |
