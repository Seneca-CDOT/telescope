// NOTE: you need to run the sso and login services in docker for these to work
const { hash, fetch } = require('@senecacdot/satellite');
const { decode } = require('jsonwebtoken');

// We need to get the URL to the sso service running in docker, and the list
// of allowed origins, to compare with assumptions in the tests below.
const { login, logout } = require('./browser-util');
const { cleanupTelescopeUsers, ensureUsers } = require('./supabase-util');

const { SSO_URL, FEED_DISCOVERY_URL } = process.env;

// The user info we'll use to register. We have the following user in our login
// SSO already:
//
// | Username    | Email                       | Password  | Display Name    |
// |-------------|-----------------------------|-----------|-----------------|
// | user1       | user1@example.com           | user1pass | Johannes Kepler |
// | user2       | user2@example.com           | user2pass | Galileo Galilei |
const johannesKepler = {
  firstName: 'Johannes',
  lastName: 'Kepler',
  email: 'user1@example.com',
  displayName: 'Johannes Kepler',
  isAdmin: true,
  isFlagged: false,
  feeds: ['http://localhost:8888/feed.xml'],
  githubUsername: 'jkepler',
  githubAvatarUrl:
    'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
};
const galileoGalilei = {
  firstName: 'Galileo',
  lastName: 'Galilei',
  email: 'user2@example.com',
  displayName: 'Galileo Galilei',
  isAdmin: false,
  isFlagged: false,
  feeds: ['http://localhost:8888/feed.xml'],
  githubUsername: 'hlippershey',
  githubAvatarUrl:
    'https://avatars.githubusercontent.com/u/33902374?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
};

const users = [galileoGalilei, johannesKepler];

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
    ensureUsers(users, false));

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

    // Part 3: use the access token to POST to the SSO service in order to
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
      expect(jwt.picture).toEqual(galileoGalilei.githubAvatarUrl);

      return { id: jwt.sub, token };
    }

    const { accessToken } = await partOne();
    const feedUrls = await partTwo(accessToken);
    await partThree(feedUrls, accessToken);
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

  it('Signup flow fails if feed is already used by another Telescope user', async () => {
    // create the user1(johannes) account.
    const account1 = await login(page, 'user1', 'user1pass');
    const res = await fetch(`${SSO_URL}/register`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${account1.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(johannesKepler),
    });
    expect(res.status).toBe(201);

    // Logout User1
    await page.goto(`http://localhost:8888/auth.html`);
    const logoutResult = await logout(page);
    expect(logoutResult.token).toEqual(undefined);

    // create the user2(Galileo) account.
    const account2 = await login(page, 'user2', 'user2pass');
    const res2 = await fetch(`${SSO_URL}/register`, {
      method: 'POST',
      headers: {
        Authorization: `bearer ${account2.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(galileoGalilei),
    });
    expect(res2.status).toBe(409);
  });
});
