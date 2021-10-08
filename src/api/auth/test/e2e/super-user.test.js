// NOTE: you need to run the auth and login services in docker for these to work
const { hash } = require('@senecacdot/satellite');

const { login, createTelescopeUsers, cleanupTelescopeUsers, ensureUsers } = require('./utils');

// We have 3 SSO user accounts in the login service (see config/simplesamlphp-users.php):
//
// | Username    | Email                       | Password  | Display Name    |
// |-------------|-----------------------------|-----------|-----------------|
// | user1       | user1@example.com           | user1pass | Johannes Kepler |
// | user2       | user2@example.com           | user2pass | Galileo Galilei |
// | lippersheyh | hans-lippershey@example.com | telescope | Hans Lippershey |

describe('Super User Authentication', () => {
  describe('Seneca Super User', () => {
    beforeEach(async () => {
      context = await browser.newContext();
      page = await browser.newPage();
      await page.goto(`http://localhost:8888/auth.html`);
    });

    afterEach(async () => {
      await context.close();
      await page.close();
    });

    it('Super user can login, and has expected token payload', async () => {
      const email = 'user1@example.com';
      const { jwt } = await login(page, 'user1', 'user1pass');
      expect(jwt.sub).toEqual(hash(email));
      expect(jwt.email).toEqual(email);
      expect(Array.isArray(jwt.roles)).toBe(true);
      expect(jwt.roles.length).toBe(2);
      // A Seneca Super User will have `seneca` and `admin` only
      expect(jwt.roles).toEqual(['seneca', 'admin']);
    });
  });

  describe('Telescope Admin User', () => {
    const johannesKepler = {
      firstName: 'Johannes',
      lastName: 'Kepler',
      email: 'user1@example.com',
      displayName: 'Johannes Kepler',
      // Set this to `true` so we can test having it set in db
      isAdmin: true,
      isFlagged: false,
      feeds: ['https://imaginary.blog.com/feed/johannes'],
      github: {
        username: 'jkepler',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };
    const users = [johannesKepler];

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

    it('should have all expected Telescope users in Users service for test data accounts', () =>
      ensureUsers(users));

    it('Super user can login, and has expected token payload', async () => {
      const { jwt } = await login(page, 'user1', 'user1pass');
      expect(jwt.sub).toEqual(hash(johannesKepler.email));
      expect(jwt.email).toEqual(johannesKepler.email);
      expect(Array.isArray(jwt.roles)).toBe(true);
      expect(jwt.roles.length).toBe(3);
      // `admin` is the one we really care about here
      expect(jwt.roles).toEqual(['seneca', 'telescope', 'admin']);
    });
  });

  describe('Telescope Non-Admin, Super User', () => {
    const johannesKepler = {
      firstName: 'Johannes',
      lastName: 'Kepler',
      email: 'user1@example.com',
      displayName: 'Johannes Kepler',
      // Force this to false, so we can test overriding via ADMINISTRATORS variable
      // in `config/env.development`
      isAdmin: false,
      isFlagged: false,
      feeds: ['https://imaginary.blog.com/feed/johannes'],
      github: {
        username: 'jkepler',
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };
    const users = [johannesKepler];

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

    it('should have all expected Telescope users in Users service for test data accounts', () =>
      ensureUsers(users));

    it('Super user can login, and has expected token payload', async () => {
      const { jwt } = await login(page, 'user1', 'user1pass');
      expect(jwt.sub).toEqual(hash(johannesKepler.email));
      expect(jwt.email).toEqual(johannesKepler.email);
      expect(Array.isArray(jwt.roles)).toBe(true);
      expect(jwt.roles.length).toBe(3);
      // `admin` is the one we really care about here
      expect(jwt.roles).toEqual(['seneca', 'telescope', 'admin']);
    });
  });
});
