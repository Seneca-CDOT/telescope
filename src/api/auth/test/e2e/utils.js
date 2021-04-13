// Common utility functions and data for the auth tests
const { decode } = require('jsonwebtoken');
const { createServiceToken, hash } = require('@senecacdot/satellite');
const fetch = require('node-fetch');

// In tests, we need to hit this via a public URL like the front-end would
// vs. the internal Docker URL, which the services use from the regular env value.
const USERS_URL = `http://localhost/v1/users`;

const createTelescopeUsers = (users) =>
  Promise.all(
    users.map((user) =>
      fetch(`${USERS_URL}/${hash(user.email)}`, {
        method: 'post',
        headers: {
          Authorization: `bearer ${createServiceToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      })
        .then((res) => {
          // We should get a 201 (created), but if the user exists, a 400 (which is fine here)
          if (!(res.status === 201 || res.status === 400)) {
            throw new Error(`got unexpected status ${res.status}`);
          }
        })
        .catch((err) => {
          console.error('Unable to create user with Users service', { err });
        })
    )
  );

// Delete the Telescope users we created in the Users service.
const cleanupTelescopeUsers = (users) =>
  Promise.all(
    users.map((user) =>
      fetch(`${USERS_URL}/${hash(user.email)}`, {
        method: 'delete',
        headers: {
          Authorization: `bearer ${createServiceToken()}`,
        },
      })
    )
  );

// Get the access_token and state from the URL, and parse the token as JWT if present
const getTokenAndState = (page) => {
  const params = new URL(page.url()).searchParams;
  const accessToken = params.get('access_token');
  const state = params.get('state');

  return { accessToken, state, jwt: accessToken ? decode(accessToken) : null };
};

// Do a complete login flow with the username/password and return token and state
const login = async (page, username, password) => {
  // Click login button and then wait for the login page to load
  await Promise.all([
    page.waitForNavigation({
      url: /simplesaml\/module\.php\/core\/loginuserpass\.php/,
      waitUtil: 'networkidle',
    }),
    page.click('#login'),
  ]);

  // Fill the login form, star with username
  await page.click('input[name="username"]');
  await page.fill('input[name="username"]', username);
  // Now enter the password
  await page.click('input[name="password"]');
  await page.fill('input[name="password"]', password);

  // Click login button and then wait for the new page to load
  await Promise.all([
    page.waitForNavigation({
      url: /^http:\/\/localhost:\d+\/\?access_token=[^&]+&state=/,
      waitUtil: 'load',
    }),
    page.click('text=/.*Login.*/'),
  ]);

  // The token and state will get returned on the query string
  return getTokenAndState(page);
};

// Logout flow, assumes user is logged in already
const logout = async (page) => {
  // Click logout and we should get navigated back to this page right away
  await Promise.all([
    page.waitForNavigation({
      url: /^http:\/\/localhost:\d+\/\?state=/,
      waitUtil: 'load',
    }),
    page.click('#logout'),
  ]);

  // The token and state will get returned on the query string
  return getTokenAndState(page);
};

module.exports.USERS_URL = USERS_URL;
module.exports.createTelescopeUsers = createTelescopeUsers;
module.exports.cleanupTelescopeUsers = cleanupTelescopeUsers;
module.exports.getTokenAndState = getTokenAndState;
module.exports.login = login;
module.exports.logout = logout;
