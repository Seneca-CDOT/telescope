// NOTE: you need to run the auth and login services in docker for these to work
const { createServiceToken, hash } = require('@senecacdot/satellite');
const fetch = require('node-fetch');

// We need to get the URL to the auth service running in docker, and the list
// of allowed origins, to compare with assumptions in the tests below.
const { login, logout, USERS_URL, cleanupTelescopeUsers } = require('./utils');

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
  feeds: ['https://hans.blog.com/feed'],
  github: {
    username: 'hlippershey',
    avatarUrl:
      'https://avatars.githubusercontent.com/u/33902374?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
  },
};

const users = [galileoGalilei];

describe('Signup Flow', () => {
  beforeAll(async () => {
    // Make sure the user account we want to use for signup isn't already there.
    await cleanupTelescopeUsers(users);
  });
  afterAll(async () => {
    await browser.close();
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

  it('should have none of the users in the Users service for test data accounts', () =>
    Promise.all(
      users.map((user) =>
        fetch(`${USERS_URL}/${hash(user.email)}`, {
          headers: {
            Authorization: `bearer ${createServiceToken()}`,
            'Content-Type': 'application/json',
          },
        }).then((res) => {
          expect(res.status).toEqual(404);
        })
      )
    ));

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
      // to access :8888 on the docker host vs. it's own localhost, so we use
      // host.docker.internal vs. localhost.
      const blogUrl = 'http://host.docker.internal:8888/blog.html';
      const feedUrl = 'https://hans.blog.com/feed';

      const res = await fetch('http://localhost/v1/feed-discovery', {
        method: 'POST',
        headers: {
          Authorization: `bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blogUrl }),
      });
      expect(res.status).toBe(200);
      const result = await res.json();
      expect(result).toEqual({ feedUrls: [feedUrl] });
      return feedUrl;
    }

    // Part 3: use the access token to POST to the Users service in order to
    // register with Telescope.
    async function partThree(feedUrl, accessToken, jwt) {
      const user = { ...galileoGalilei, feeds: [feedUrl] };
      const res = await fetch(`${USERS_URL}/${jwt.sub}`, {
        method: 'POST',
        headers: {
          Authorization: `bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      expect(res.status).toBe(201);
    }

    // Part 4: logout so we can try logging in again as a registered user.
    // Confirm that the token payload matches our upgraded user status.
    // Confirm that the data in the Users service for this user
    // matches what we expect, and that our token allows us to access it.
    async function partFour() {
      // Logout
      await logout(page);

      // Login again
      const { accessToken, jwt } = await login(page, 'user2', 'user2pass');

      // Check token payload, make sure it matches what we expect
      expect(jwt.sub).toEqual(hash(galileoGalilei.email));
      expect(jwt.email).toEqual(galileoGalilei.email);
      expect(jwt.given_name).toEqual(galileoGalilei.firstName);
      expect(jwt.family_name).toEqual(galileoGalilei.lastName);
      expect(jwt.name).toEqual(galileoGalilei.displayName);
      expect(jwt.roles).toEqual(['seneca', 'telescope']);
      expect(jwt.picture).toEqual(galileoGalilei.github.avatarUrl);

      // See if we can use this token to talk to the Users service, confirm our data.
      const res = await fetch(`${USERS_URL}/${jwt.sub}`, {
        headers: {
          Authorization: `bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      expect(res.ok).toBe(true);
      const data = await res.json();
      expect(data).toEqual(galileoGalilei);
    }

    const { accessToken, jwt } = await partOne();
    const feedUrl = await partTwo(accessToken);
    await partThree(feedUrl, accessToken, jwt);
    await partFour();
  });
});
