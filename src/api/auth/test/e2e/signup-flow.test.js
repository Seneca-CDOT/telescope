// NOTE: you need to run the auth and login services in docker for these to work
const { chromium } = require('playwright');
const { decode } = require('jsonwebtoken');
const { createServiceToken, hash } = require('@senecacdot/satellite');
const fetch = require('node-fetch');

const { USERS_URL } = process.env;

// Delete the Telescope user we created in the Users service.
const cleanupTelescopeUser = () =>
  Promise.all(
    ['user1@example.com', 'hans-lippershey@example.com'].map((email) =>
      fetch(`${USERS_URL}/${hash(email)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `bearer ${createServiceToken()}`,
        },
      })
    )
  );

describe('Signup Flow', () => {
  let browser;
  let context;
  let page;

  beforeAll(async () => {
    // Make sure the user account we want to use for signup isn't already there.
    await cleanupTelescopeUser();
    // Use launch({ headless: false, slowMo: 500 }) as options to debug
    browser = await chromium.launch();
  });
  afterAll(async () => {
    await browser.close();
    await cleanupTelescopeUser();
  });

  beforeEach(async () => {
    context = await browser.newContext();
    page = await browser.newPage();
    await page.goto(`http://localhost:8888/`);
  });
  afterEach(async () => {
    await context.close();
    await page.close();
  });

  // Get the access_token and state from the URL, and parse the token as JWT if present
  const getTokenAndState = () => {
    const params = new URL(page.url()).searchParams;
    const accessToken = params.get('access_token');
    const state = params.get('state');

    return { accessToken, state, jwt: accessToken ? decode(accessToken) : null };
  };

  // Do a complete login flow with the username/password and return token and state
  const login = async (username, password) => {
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
    return getTokenAndState();
  };

  // Logout flow, assumes user is logged in already
  const logout = async () => {
    // Click logout and we should get navigated back to this page right away
    await Promise.all([
      page.waitForNavigation({
        url: /^http:\/\/localhost:\d+\/\?state=/,
        waitUtil: 'load',
      }),
      page.click('#logout'),
    ]);

    // The token and state will get returned on the query string
    return getTokenAndState();
  };

  it('signup flow works to login and register a new Telescope user', async () => {
    // The user info we'll use to register. We have the following user in our login
    // SSO already:
    //
    // | Username    | Email                       | Password  | Display Name    |
    // |-------------|-----------------------------|-----------|-----------------|
    // | lippersheyh | hans-lippershey@example.com | telescope | Hans Lippershey |
    const user = {
      firstName: 'Hans',
      lastName: 'Lippershey',
      email: 'hans-lippershey@example.com',
      displayName: 'Hans Lippershey',
      isAdmin: false,
      isFlagged: false,
      feeds: ['https://imaginary.blog.com/feed/hans'],
      github: {
        username: 'hlippershey',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/33902374?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };

    // Part 1: login using SSO, as a user who does not have a Telescope account.
    // Confirm that the payload of the token we get back matches what we expect.
    // NOTE: the data comes from config/simplesamlphp-users.php.
    async function partOne() {
      const { accessToken, jwt } = await login('lippersheyh', 'telescope');

      // Step 2: confirm the token's payload for this user
      expect(jwt.sub).toEqual(user.email);
      expect(jwt.name).toEqual(user.displayName);
      expect(jwt.roles).toEqual(['seneca']);
      expect(jwt.picture).toBe(undefined);

      return { accessToken, jwt };
    }

    // Part 2: use the access token to POST to the Users service in order to
    // register with Telescope.
    async function partTwo(accessToken, jwt) {
      const res = await fetch(`${USERS_URL}/${hash(jwt.sub)}`, {
        method: 'POST',
        headers: {
          Authorization: `bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      expect(res.ok).toBe(true);
    }

    // Part 3: logout so we can try logging in again as a registered user.
    // Confirm that the token payload matches our upgraded user status.
    // Confirm that the data in the Users service for this user
    // matches what we expect, and that our token allows us to access it.
    async function partThree() {
      // Logout
      await logout();

      // Login again
      const { accessToken, jwt } = await login('lippersheyh', 'telescope');

      // Check token payload, make sure it matches what we expect
      expect(jwt.sub).toEqual(user.email);
      expect(jwt.name).toEqual(user.displayName);
      expect(jwt.roles).toEqual(['seneca', 'telescope']);
      expect(jwt.picture).toEqual(user.github.avatarUrl);

      // See if we can use this token to talk to the Users service, confirm our data.
      const res = await fetch(`${USERS_URL}/${hash(jwt.sub)}`, {
        headers: {
          Authorization: `bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      expect(res.ok).toBe(true);
      const data = await res.json();
      expect(data).toEqual(user);
    }

    const { accessToken, jwt } = await partOne();
    await partTwo(accessToken, jwt);
    await partThree();
  });
});
