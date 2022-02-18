// Common utility functions and data for the sso tests
const { decode } = require('jsonwebtoken');

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
      url: /^http:\/\/localhost:\d+\/auth\.html\?access_token=[^&]+&state=/,
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
      url: /^http:\/\/localhost:\d+\/auth\.html\?state=/,
      waitUtil: 'load',
    }),
    page.click('#logout'),
  ]);

  // The token and state will get returned on the query string
  return getTokenAndState(page);
};

module.exports.getTokenAndState = getTokenAndState;
module.exports.login = login;
module.exports.logout = logout;
