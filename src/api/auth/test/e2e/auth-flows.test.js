// NOTE: you need to run the auth and login services in docker for these to work
const { hash } = require('@senecacdot/satellite');

// We need to get the URL to the auth service running in docker, and the list
// of allowed origins, to compare with assumptions in the tests below.
const { AUTH_URL, ALLOWED_APP_ORIGINS } = process.env;
const {
  login,
  logout,
  getTokenAndState,
  createTelescopeUsers,
  cleanupTelescopeUsers,
  ensureUsers,
} = require('./utils');

// We have 3 SSO user accounts in the login service (see config/simplesamlphp-users.php):
//
// | Username    | Email                       | Password  | Display Name    |
// |-------------|-----------------------------|-----------|-----------------|
// | user1       | user1@example.com           | user1pass | Johannes Kepler |
// | user2       | user2@example.com           | user2pass | Galileo Galilei |
// | lippersheyh | hans-lippershey@example.com | telescope | Hans Lippershey |

// Admin Telescope user
const johannesKepler = {
  firstName: 'Johannes',
  lastName: 'Kepler',
  email: 'user1@example.com',
  displayName: 'Johannes Kepler',
  isAdmin: true,
  isFlagged: false,
  feeds: ['https://imaginary.blog.com/feed/johannes'],
  github: {
    username: 'jkepler',
    avatarUrl:
      'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
  },
};
// Regular Telescope user
const hansLippershey = {
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
// Seneca user, not registered with Telescope
const galileoGalilei = {
  firstName: 'Galileo',
  lastName: 'Galilei',
  email: 'user2@example.com',
  displayName: 'Galileo Galilei',
};

// Create 2 Telescope accounts, one for user1@example.com and one for hans-lippershey@example.com.
const users = [johannesKepler, hansLippershey];

describe('Authentication Flows', () => {
  beforeEach(async () => {
    await createTelescopeUsers(users);

    context = await browser.newContext();
    page = await browser.newPage();
    await page.goto(`http://localhost:8888/auth.html`);
  });

  afterEach(async () => {
    await cleanupTelescopeUsers(users);
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
    ensureUsers(users));

  it('Login flow preserves state param', async () => {
    const { state } = await login(page, 'user1', 'user1pass');
    // Expect the state to match what we sent originally (see index.html <a>)
    expect(state).toEqual('abc123');
  });

  it('Login flow issues JWT access token with with expected sub claim', async () => {
    const { jwt } = await login(page, 'user1', 'user1pass');
    // The sub claim should match our user's email
    expect(typeof jwt === 'object').toBe(true);
    expect(jwt.sub).toEqual(hash(johannesKepler.email));
  });

  it('Admin user can login, and has expected token payload', async () => {
    const { jwt } = await login(page, 'user1', 'user1pass');
    expect(jwt.sub).toEqual(hash(johannesKepler.email));
    expect(jwt.email).toEqual(johannesKepler.email);
    expect(jwt.given_name).toEqual(johannesKepler.firstName);
    expect(jwt.family_name).toEqual(johannesKepler.lastName);
    expect(jwt.name).toEqual(johannesKepler.displayName);
    expect(Array.isArray(jwt.roles)).toBe(true);
    expect(jwt.roles.length).toBe(3);
    expect(jwt.roles).toEqual(['seneca', 'telescope', 'admin']);
    expect(jwt.picture).toEqual(johannesKepler.github.avatarUrl);
  });

  it('Telescope user can login, and has expected token payload', async () => {
    const { jwt } = await login(page, 'lippersheyh', 'telescope');
    expect(jwt.sub).toEqual(hash(hansLippershey.email));
    expect(jwt.email).toEqual(hansLippershey.email);
    expect(jwt.given_name).toEqual(hansLippershey.firstName);
    expect(jwt.family_name).toEqual(hansLippershey.lastName);
    expect(jwt.name).toEqual(hansLippershey.displayName);
    expect(Array.isArray(jwt.roles)).toBe(true);
    expect(jwt.roles.length).toBe(2);
    expect(jwt.roles).toEqual(['seneca', 'telescope']);
    expect(jwt.picture).toEqual(hansLippershey.github.avatarUrl);
  });

  it('Seneca user can login, and has expected token payload', async () => {
    const { jwt } = await login(page, 'user2', 'user2pass');
    expect(jwt.sub).toEqual(hash(galileoGalilei.email));
    expect(jwt.email).toEqual(galileoGalilei.email);
    expect(jwt.given_name).toEqual(galileoGalilei.firstName);
    expect(jwt.family_name).toEqual(galileoGalilei.lastName);
    expect(jwt.name).toEqual(galileoGalilei.displayName);
    expect(Array.isArray(jwt.roles)).toBe(true);
    expect(jwt.roles.length).toBe(1);
    expect(jwt.roles).toEqual(['seneca']);
    expect(jwt.picture).toBe(undefined);
  });

  it("Logging in twice doesn't require username and password again", async () => {
    const firstLogin = await login(page, 'user1', 'user1pass');
    expect(firstLogin.jwt.sub).toEqual(hash(johannesKepler.email));

    // Click login again, but we should get navigated back to this page right away
    await Promise.all([
      page.waitForNavigation({
        url: /^http:\/\/localhost:\d+\/auth\.html\?access_token=[^&]+&state=/,
        waitUtil: 'load',
      }),
      page.click('#login'),
    ]);

    // The sub claim should be the same as before (we're still logged in)
    const secondLogin = getTokenAndState(page);
    expect(secondLogin.jwt.sub).toEqual(firstLogin.jwt.sub);
  });

  describe('Logout', () => {
    it('Logout works after logging in', async () => {
      const firstLogin = await login(page, 'user1', 'user1pass');
      expect(firstLogin.jwt.sub).toEqual(hash(johannesKepler.email));

      // The sub claim should be the same as before (we're still logged in)
      const logoutResult = await logout(page);
      expect(logoutResult.state).toEqual('abc123');
      expect(logoutResult.token).toEqual(undefined);
    });

    it('Logging in works after logout', async () => {
      const firstLogin = await login(page, 'user1', 'user1pass');
      expect(firstLogin.jwt.sub).toEqual(hash(johannesKepler.email));

      // The sub claim should be the same as before (we're still logged in)
      const logoutResult = await logout(page);
      expect(logoutResult.state).toEqual('abc123');
      expect(logoutResult.token).toEqual(undefined);

      const secondLogin = await login(page, 'user2', 'user2pass');
      expect(secondLogin.jwt.sub).toEqual(hash(galileoGalilei.email));
    });
  });
});
