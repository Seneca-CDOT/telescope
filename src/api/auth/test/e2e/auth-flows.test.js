// NOTE: you need to run the auth and login services in docker for these to work
const { chromium } = require('playwright');
const { decode } = require('jsonwebtoken');
const { createServiceToken, hash } = require('@senecacdot/satellite');
const fetch = require('node-fetch');

// We need to get the URL to the auth service running in docker, and the list
// of allowed origins, to compare with assumptions in the tests below.
const { AUTH_URL, ALLOWED_APP_ORIGINS } = process.env;

let browser;
let context;
let page;

// We have 3 SSO user accounts in the login service (see config/simplesamlphp-users.php):
//
// | Username    | Email                       | Password  | Display Name    |
// |-------------|-----------------------------|-----------|-----------------|
// | user1       | user1@example.com           | user1pass | Johannes Kepler |
// | user2       | user2@example.com           | user2pass | Galileo Galilei |
// | lippersheyh | hans-lippershey@example.com | telescope | Hans Lippershey |
//
// Create 2 Telescope accounts, one for user1@example.com and one for hans-lippershey@example.com.
const users = [
  {
    firstName: 'Johannes',
    lastName: 'Kepler',
    email: 'user1@example.com',
    displayName: 'Johannes Kepler',
    // this is a Telescope admin
    isAdmin: true,
    isFlagged: false,
    feeds: ['https://imaginary.blog.com/feed/johannes'],
    github: {
      username: 'jkepler',
      avatarUrl:
        'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
    },
  },
  {
    firstName: 'Hans',
    lastName: 'Lippershey',
    email: 'hans-lippershey@example.com',
    displayName: 'Hans Lippershey',
    // Regular Telescope user
    isAdmin: false,
    isFlagged: false,
    feeds: ['https://imaginary.blog.com/feed/hans'],
    github: {
      username: 'hlippershey',
      avatarUrl:
        'https://avatars.githubusercontent.com/u/33902374?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
    },
  },
];

const createTelescopeUsers = () =>
  Promise.all(
    users.map((user) =>
      fetch(`http://localhost/v1/users/${hash(user.email)}`, {
        method: 'post',
        headers: {
          Authorization: `bearer ${createServiceToken()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      }).catch((err) => {
        console.error('Unable to create user with Users service', { err });
      })
    )
  );

// Delete the Telescope users we created in the Users service.
const cleanupTelescopeUsers = () =>
  Promise.all(
    ['user1@example.com', 'hans-lippershey@example.com'].map((email) =>
      fetch(`http://localhost/v1/users/${hash(email)}`, {
        method: 'delete',
        headers: {
          Authorization: `bearer ${createServiceToken()}`,
        },
      })
    )
  );

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

beforeAll(async () => {
  // Use launch({ headless: false, slowMo: 500 }) as options to debug
  browser = await chromium.launch();
});
afterAll(async () => {
  await browser.close();
  await cleanupTelescopeUsers();
});

beforeEach(async () => {
  // We need some Telescope users created in our Users service, so we can try
  // logging into both the Login service and Users.  In case we somehow have
  // these users created from some other test, remove then recreate.
  await cleanupTelescopeUsers();
  await createTelescopeUsers();

  context = await browser.newContext();
  page = await browser.newPage();
  await page.goto(`http://localhost:8888/`);
});
afterEach(async () => {
  await context.close();
  await page.close();
});

it('should use the same origin in .env for ALLOWED_APP_ORIGINS that test cases use', () => {
  const origins = ALLOWED_APP_ORIGINS.split(' ');
  expect(origins).toContain('http://localhost:8888');
});

it('should use the same AUTH_URL as we have hard-coded in the test HTML', () => {
  expect(AUTH_URL).toEqual('http://localhost/v1/auth');
});

it('should have all expected Telescope users in Users service for test data accounts', () =>
  Promise.all(
    users.map((user) =>
      fetch(`http://localhost/v1/users/${hash(user.email)}`).then((res) =>
        expect(res.status).toEqual(200)
      )
    )
  ));

it('Login flow preserves state param', async () => {
  const { state } = await login('user2', 'user2pass');
  // Expect the state to match what we sent originally (see index.html <a>)
  expect(state).toEqual('abc123');
});

it('Login flow issues JWT access token with with expected sub claim', async () => {
  const { jwt } = await login('user2', 'user2pass');
  // The sub claim should match our user's email
  expect(typeof jwt === 'object').toBe(true);
  expect(jwt.sub).toEqual(hash('user2@example.com'));
});

it('Admin user can login, and has expected token payload', async () => {
  const { jwt } = await login('user1', 'user1pass');
  expect(jwt.sub).toEqual(hash('user1@example.com'));
  expect(jwt.email).toEqual('user1@example.com');
  expect(jwt.given_name).toEqual('Johannes');
  expect(jwt.family_name).toEqual('Kepler');
  expect(jwt.name).toEqual('Johannes Kepler');
  expect(Array.isArray(jwt.roles)).toBe(true);
  expect(jwt.roles.length).toBe(3);
  expect(jwt.roles).toEqual(['seneca', 'telescope', 'admin']);
  expect(jwt.picture).toEqual(
    'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4'
  );
});

it('Telescope user can login, and has expected token payload', async () => {
  const { jwt } = await login('lippersheyh', 'telescope');
  expect(jwt.sub).toEqual(hash('hans-lippershey@example.com'));
  expect(jwt.email).toEqual('hans-lippershey@example.com');
  expect(jwt.given_name).toEqual('Hans');
  expect(jwt.family_name).toEqual('Lippershey');
  expect(jwt.name).toEqual('Hans Lippershey');
  expect(Array.isArray(jwt.roles)).toBe(true);
  expect(jwt.roles.length).toBe(2);
  expect(jwt.roles).toEqual(['seneca', 'telescope']);
  expect(jwt.picture).toEqual(
    'https://avatars.githubusercontent.com/u/33902374?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4'
  );
});

it('Seneca user can login, and has expected token payload', async () => {
  const { jwt } = await login('user2', 'user2pass');
  expect(jwt.sub).toEqual(hash('user2@example.com'));
  expect(jwt.email).toEqual('user2@example.com');
  expect(jwt.given_name).toEqual('Galileo');
  expect(jwt.family_name).toEqual('Galilei');
  expect(jwt.name).toEqual('Galileo Galilei');
  expect(Array.isArray(jwt.roles)).toBe(true);
  expect(jwt.roles.length).toBe(1);
  expect(jwt.roles).toEqual(['seneca']);
  expect(jwt.picture).toBe(undefined);
});

it("Logging in twice doesn't require username and password again", async () => {
  const firstLogin = await login('user1', 'user1pass');
  expect(firstLogin.jwt.sub).toEqual(hash('user1@example.com'));

  // Click login again, but we should get navigated back to this page right away
  await Promise.all([
    page.waitForNavigation({
      url: /^http:\/\/localhost:\d+\/\?access_token=[^&]+&state=/,
      waitUtil: 'load',
    }),
    page.click('#login'),
  ]);

  // The sub claim should be the same as before (we're still logged in)
  const secondLogin = getTokenAndState();
  expect(secondLogin.jwt.sub).toEqual(firstLogin.jwt.sub);
});

describe('Logout', () => {
  it('Logout works after logging in', async () => {
    const firstLogin = await login('user1', 'user1pass');
    expect(firstLogin.jwt.sub).toEqual(hash('user1@example.com'));

    // The sub claim should be the same as before (we're still logged in)
    const logoutResult = await logout();
    expect(logoutResult.state).toEqual('abc123');
    expect(logoutResult.token).toEqual(undefined);
  });

  it('Logging in works after logout', async () => {
    const firstLogin = await login('user1', 'user1pass');
    expect(firstLogin.jwt.sub).toEqual(hash('user1@example.com'));

    // The sub claim should be the same as before (we're still logged in)
    const logoutResult = await logout();
    expect(logoutResult.state).toEqual('abc123');
    expect(logoutResult.token).toEqual(undefined);

    const secondLogin = await login('user2', 'user2pass');
    expect(secondLogin.jwt.sub).toEqual(hash('user2@example.com'));
  });
});
