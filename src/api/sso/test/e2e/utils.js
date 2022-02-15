// Common utility functions and data for the sso tests
const { decode } = require('jsonwebtoken');
const { hash } = require('@senecacdot/satellite');

const { createClient } = require('@supabase/supabase-js');

const { SUPABASE_URL, SERVICE_ROLE_KEY } = process.env;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const createTelescopeUsers = (users) =>
  Promise.all(
    users.map((user) =>
      supabase
        .from('telescope_profiles')
        .insert(
          {
            id: hash(user.email),
            email: user.email,
            first_name: user.firstName,
            last_name: user.lastName,
            display_name: user.displayName,
            github_username: user.githubUsername,
            github_avatar_url: user.githubAvatarUrl,
          },
          { returning: 'minimal' }
        )
        .then((result) => {
          if (result.error) {
            throw new Error(`unable to insert user into Supabase: ${result.error.message}`);
          }
          return result;
        })
    )
  );

// Delete the Telescope users we created in the Users service.
const cleanupTelescopeUsers = (users) =>
  Promise.all(
    users.map((user) =>
      supabase
        .from('telescope_profiles')
        .delete()
        .match({ id: hash(user.email) })
        .then((result) => {
          if (result.error) {
            throw new Error(`unable to delete user from Supabase: ${result.error.message}`);
          }
          return result;
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

// Given an array of users, make sure they all respond with the expected HTTP
// result via the Users Service.
const ensureUsers = (users, shouldExist = true) =>
  Promise.all(
    users.map(async (user) => {
      const { data: profiles, error } = await supabase
        .from('telescope_profiles')
        .select('*')
        .eq('id', user.id || hash(user.email))
        .limit(1);

      expect(error).toBe(null);

      if (shouldExist) {
        expect(profiles.length).toBe(1);
      } else {
        expect(profiles.length).toBe(0);
      }
    })
  );

module.exports.createTelescopeUsers = createTelescopeUsers;
module.exports.cleanupTelescopeUsers = cleanupTelescopeUsers;
module.exports.getTokenAndState = getTokenAndState;
module.exports.login = login;
module.exports.logout = logout;
module.exports.ensureUsers = ensureUsers;
