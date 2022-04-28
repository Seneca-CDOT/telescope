const { test, expect } = require('@playwright/test');

// NOTE: you need to run the sso and login services in docker for these to work
const { hash } = require('@senecacdot/satellite');

// We need to get the URL to the sso service running in docker, and the list
// of allowed origins, to compare with assumptions in the tests below.
const { SSO_URL, ALLOWED_APP_ORIGINS } = process.env;
const { login, logout, getTokenAndState } = require('./lib/browser-util');
const { createTelescopeUsers, cleanupTelescopeUsers, ensureUsers } = require('./lib/supabase-util');

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
  githubUsername: 'jkepler',
  githubAvatarUrl:
    'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
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
  githubUsername: 'hlippershey',
  githubAvatarUrl:
    'https://avatars.githubusercontent.com/u/33902374?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
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

test.describe('Authentication Flows', () => {
  test.beforeEach(async ({ page }) => {
    await createTelescopeUsers(users);
    return page.goto(`http://localhost:8888/auth.html`);
  });

  test.afterEach(() => cleanupTelescopeUsers(users));

  test('should use the same origin in .env for ALLOWED_APP_ORIGINS that test cases use', () => {
    const origins = ALLOWED_APP_ORIGINS.split(' ');
    expect(origins).toContain('http://localhost:8888');
  });

  test('should use the same SSO_URL as we have hard-coded in the test HTML', () => {
    expect(SSO_URL).toEqual('http://localhost/v1/auth');
  });

  test('should have all expected Telescope users in Users service for test data accounts', () =>
    ensureUsers(users));

  test('Login flow preserves state param', async ({ page }) => {
    const { state } = await login(page, 'user1', 'user1pass');
    // Expect the state to match what we sent originally (see index.html <a>)
    expect(state).toEqual('abc123');
  });

  test('Login flow issues JWT access token with with expected sub claim', async ({ page }) => {
    const { jwt } = await login(page, 'user1', 'user1pass');
    // The sub claim should match our user's email
    expect(typeof jwt === 'object').toBe(true);
    expect(jwt.sub).toEqual(hash(johannesKepler.email));
  });

  test('Admin user can login, and has expected token payload', async ({ page }) => {
    const { jwt } = await login(page, 'user1', 'user1pass');
    expect(jwt.sub).toEqual(hash(johannesKepler.email));
    expect(jwt.email).toEqual(johannesKepler.email);
    expect(jwt.given_name).toEqual(johannesKepler.firstName);
    expect(jwt.family_name).toEqual(johannesKepler.lastName);
    expect(jwt.name).toEqual(johannesKepler.displayName);
    expect(Array.isArray(jwt.roles)).toBe(true);
    expect(jwt.roles.length).toBe(3);
    expect(jwt.roles).toEqual(['seneca', 'telescope', 'admin']);
    expect(jwt.picture).toEqual(johannesKepler.githubAvatarUrl);
  });

  test('Telescope user can login, and has expected token payload', async ({ page }) => {
    const { jwt } = await login(page, 'lippersheyh', 'telescope');
    expect(jwt.sub).toEqual(hash(hansLippershey.email));
    expect(jwt.email).toEqual(hansLippershey.email);
    expect(jwt.given_name).toEqual(hansLippershey.firstName);
    expect(jwt.family_name).toEqual(hansLippershey.lastName);
    expect(jwt.name).toEqual(hansLippershey.displayName);
    expect(Array.isArray(jwt.roles)).toBe(true);
    expect(jwt.roles.length).toBe(2);
    expect(jwt.roles).toEqual(['seneca', 'telescope']);
    expect(jwt.picture).toEqual(hansLippershey.githubAvatarUrl);
  });

  test('Seneca user can login, and has expected token payload', async ({ page }) => {
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

  test("Logging in twice doesn't require username and password again", async ({ page }) => {
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

  test.describe('Logout', () => {
    test('Logout works after logging in', async ({ page }) => {
      const firstLogin = await login(page, 'user1', 'user1pass');
      expect(firstLogin.jwt.sub).toEqual(hash(johannesKepler.email));

      // The sub claim should be the same as before (we're still logged in)
      const logoutResult = await logout(page);
      expect(logoutResult.state).toEqual('abc123');
      expect(logoutResult.token).toEqual(undefined);
    });

    test('Logging in works after logout', async ({ page }) => {
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
