// NOTE: you need to run the sso and login services in docker for these to work
const { hash, fetch } = require('@senecacdot/satellite');
const { decode } = require('jsonwebtoken');

// We need to get the URL to the sso service running in docker, and the list
// of allowed origins, to compare with assumptions in the tests below.
const { login, logout, USERS_URL, cleanupTelescopeUsers, ensureUsers } = require('./utils');

const { SSO_URL, FEED_DISCOVERY_URL } = process.env;

// The user info we'll use to register. We have the following user in our login
// SSO already:
//
// | Username    | Email                       | Password  | Display Name    |
// |-------------|-----------------------------|-----------|-----------------|
// | user2       | user2@example.com           | user2pass | Galileo Galilei |
const galileoGalilei = {
  firstName: 'Galileo',
  lastName: 'Galilei',
  email: 'user2@example.com',
  displayName: 'Galileo Galilei',
  isAdmin: false,
  isFlagged: false,
  feeds: ['http://localhost:8888/feed.xml'],
  github: {
    username: 'hlippershey',
    avatarUrl:
      'https://avatars.githubusercontent.com/u/33902374?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
  },
};

const users = [galileoGalilei];

describe('Signup Flow', () => {
  afterAll(async () => {
    await browser.close();
    await cleanupTelescopeUsers(users);
  });

  beforeEach(async () => {
    await cleanupTelescopeUsers(users);
    context = await browser.newContext();
    page = await browser.newPage();
    await page.goto(`http://localhost:8888/auth.html`);
  });
  afterEach(async () => {
    await context.close();
    await page.close();
  });

  it('should have none of the users in the Users service for test data accounts', () =>
    ensureUsers(users, 404));

  it('signup flow works to login and register a new Telescope user', async () => {
    // Part 1: login using SSO, as a user who does not have a Telescope account.
    // Confirm that the payload of the token we get back matches what we expect.
    // NOTE: the data comes from config/simplesamlphp-users.php.
    async function partOne() {
      const { accessToken, jwt } = await login(page, 'user2', 'user2pass');

      // Step 2: confirm the token's payload for this user
      expect(jwt.sub).toEqual(hash(galileoGalilei.email));
      expect(jwt.email).toEqual(galileoGalilei.email);
      expect(jwt.given_name).toEqual(galileoGalilei.firstName);
      expect(jwt.family_name).toEqual(galileoGalilei.lastName);
      expect(jwt.name).toEqual(galileoGalilei.displayName);
      expect(jwt.roles).toEqual(['seneca']);
      // There shouldn't be a picture
      expect(jwt.picture).toBe(undefined);

      return { accessToken, jwt };
    }

    // Part 2: use the access token to POST to the feed-discovery service in order to
    // get a list of feed URLs.
    async function partTwo(accessToken) {
      // See the file blog.html in this same folder.  NOTE: the blog is hosted
      // on port 8888 running on the host, and the feed-discovery service needs
      // to access it via the test-web-content domain internally vs. localhost.
      const blogUrl = 'http://test-web-content/blog.html';

      const res = await fetch(FEED_DISCOVERY_URL, {
        method: 'POST',
        headers: {
          Authorization: `bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blogUrl }),
      });
      expect(res.status).toBe(200);
      const result = await res.json();
      expect(result).toEqual({ feedUrls: [...galileoGalilei.feeds] });
      return result.feedUrls;
    }

    // Part 3: use the access token to POST to the Users service in order to
    // register a new Telescope user..
    async function partThree(feedUrls, accessToken) {
      const user = { ...galileoGalilei, feeds: [...feedUrls] };
      const res = await fetch(`${SSO_URL}/register`, {
        method: 'POST',
        headers: {
          Authorization: `bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      expect(res.status).toBe(201);

      // We should get back an upgraded token for this user
      const { token } = await res.json();
      const jwt = decode(token);
      // Check token payload, make sure it matches what we expect
      expect(jwt.sub).toEqual(hash(galileoGalilei.email));
      expect(jwt.email).toEqual(galileoGalilei.email);
      expect(jwt.given_name).toEqual(galileoGalilei.firstName);
      expect(jwt.family_name).toEqual(galileoGalilei.lastName);
      expect(jwt.name).toEqual(galileoGalilei.displayName);
      expect(jwt.roles).toEqual(['seneca', 'telescope']);
      expect(jwt.picture).toEqual(galileoGalilei.github.avatarUrl);

      return { id: jwt.sub, token };
    }

    // Part 4: logout so we can try logging in again as a registered user.
    // Confirm that the token payload matches our upgraded user status.
    // Confirm that the data in the Users service for this user
    // matches what we expect, and that our token allows us to access it.
    async function partFour(id, token) {
      // Logout
      await logout(page);

      // Use this upgraded token to get our user profile info and confirm.
      const res = await fetch(`${USERS_URL}/${id}`, {
        headers: {
          Authorization: `bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      expect(res.ok).toBe(true);
      const data = await res.json();
      expect(data).toEqual(galileoGalilei);
    }

    const { accessToken } = await partOne();
    const feedUrls = await partTwo(accessToken);
    const { id, token } = await partThree(feedUrls, accessToken);
    await partFour(id, token);
  });

  it('signup flow fails if user is not authenticated', async () => {
    const invalidUser = { ...galileoGalilei, email: 'wrong@email.com' };
    const res = await fetch(`${SSO_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidUser),
    });
    expect(res.status).toBe(401);
  });

  it('signup flow fails if user data is missing required properties', async () => {
    const { accessToken } = await login(page, 'user2', 'user2pass');
    const invalidUser = { ...galileoGalilei };
    // Delete the firstName, which is required
    delete invalidUser.firstName;
    const res = await fetch(`${SSO_URL}/register`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidUser),
    });
    expect(res.status).toBe(400);
  });

  it('signup flow fails if user is already a Telescope user', async () => {
    const { accessToken } = await login(page, 'user2', 'user2pass');
    const res = await fetch(`${SSO_URL}/register`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(galileoGalilei),
    });
    expect(res.status).toBe(201);
    const { token } = await res.json();

    const res2 = await fetch(`${SSO_URL}/register`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(galileoGalilei),
    });
    expect(res2.status).toBe(403);
  });
});
