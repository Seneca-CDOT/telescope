const { test, expect } = require('@playwright/test');

const { hash } = require('@senecacdot/satellite');
const { createClient } = require('@supabase/supabase-js');
const normalizeUrl = require('normalize-url');

const { SUPABASE_URL, ANON_KEY } = process.env;

const {
  createTelescopeUsers,
  cleanupTelescopeUsers,
  addFeeds,
  cleanFeeds,
} = require('./lib/supabase-util');
const { createToken } = require('../../src/token');

const createSupabaseClient = () => createClient(SUPABASE_URL, ANON_KEY);

// registered Telescope user
const telescopeUser1 = {
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

// registered Telescope user
const telescopeUser2 = {
  firstName: 'Johannes',
  lastName: 'Kepler',
  email: 'user1@example.com',
  displayName: 'Johannes Kepler',
  isAdmin: false,
  isFlagged: false,
  feeds: ['https://imaginary.blog.com/feed/johannes'],
  githubUsername: 'jkepler',
  githubAvatarUrl:
    'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
};

// unregistered user
const unregisteredUser = {
  firstName: 'Galileo',
  lastName: 'Galilei',
  email: 'user2@example.com',
  displayName: 'Galileo Galilei',
  isAdmin: false,
  isFlagged: false,
  feeds: ['https://dev.to/galileogalilei'],
  githubUsername: 'octocat',
  githubAvatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
};

// Create 2 Telescope accounts in the database
const users = [telescopeUser1, telescopeUser2];

// Create 2 feeds, 1 belongs to a user, 1 does not belong to anyone
const feedList = [
  {
    url: telescopeUser1.feeds[0],
    wikiAuthorName: telescopeUser1.displayName,
    userId: hash(telescopeUser1.email),
  },
  {
    url: unregisteredUser.feeds[0],
    wikiAuthorName: unregisteredUser.displayName,
  },
];

test.describe('Test Row Level Security Policies', () => {
  test.describe('Unauthenticated users with public anon_key', () => {
    const supabase = createSupabaseClient();
    test.describe('"telescope_profiles" security policies', () => {
      test.beforeEach(() => createTelescopeUsers(users));

      test.afterEach(() => cleanupTelescopeUsers(users));

      test('should return no users', async () => {
        const { status, count } = await supabase
          .from('telescope_profiles')
          .select('*', { count: 'exact' });

        // the request succeeds but no rows are read
        expect(status).toBe(200);
        expect(count).toBe(0);
      });

      test('should not allow creating new users', async () => {
        const { status } = await supabase.from('telescope_profiles').insert(
          {
            id: hash(unregisteredUser.email),
            email: unregisteredUser.email,
            first_name: unregisteredUser.firstName,
            last_name: unregisteredUser.lastName,
            display_name: unregisteredUser.displayName,
            github_username: unregisteredUser.githubUsername,
            github_avatar_url: unregisteredUser.githubAvatarUrl,
          },
          { returning: 'minimal' }
        );

        // forbidden, users cannot be created on the client
        expect(status).toBe(403);
      });

      test('should not allow updating users', async () => {
        const { status } = await supabase
          .from('telescope_profiles')
          .update({ display_name: 'my name' })
          .match({ id: hash(users[0].email) });

        // no rows are returned to be updated, therefore 404
        expect(status).toBe(404);
      });

      test('should not allow deleting users', async () => {
        const { status, count } = await supabase
          .from('telescope_profiles')
          .delete({ count: 'exact' })
          .match({
            id: hash(users[0].email),
          });

        // no rows are deleted
        expect(status).toBe(200);
        expect(count).toBe(0);
      });
    });

    test.describe('"feeds" security policies', () => {
      // Create feeds for HansLippershey and an unregistered user
      test.beforeEach(async () => {
        await createTelescopeUsers([telescopeUser1]);
        await addFeeds(feedList);
      });

      test.afterEach(async () => {
        await cleanFeeds(feedList);
        await cleanupTelescopeUsers([telescopeUser1]);
      });

      test('should allow reading the feeds list', async () => {
        const { status, data } = await supabase.from('feeds').select();
        expect(status).toBe(200);
        expect(data).toEqual(
          expect.arrayContaining(
            feedList.map((feed) =>
              expect.objectContaining({
                url: feed.url,
              })
            )
          )
        );
      });

      test('should not allow adding new feeds', async () => {
        const { status } = await supabase.from('feeds').insert(
          {
            url: 'http://dev.to/devto',
            id: hash(normalizeUrl('http://dev.to/devto')),
            wiki_author_name: 'devto',
          },
          { returning: 'minimal' }
        );

        // forbidden, unauthenticated users can't add new feeds
        expect(status).toBe(403);
      });

      test('should not allow updating feeds', async () => {
        const { status } = await supabase
          .from('feeds')
          .update({ html_url: 'http://dev.to/' }, { returning: 'minimal' })
          .match({ url: feedList[0].url });

        expect(status).toBe(404);
      });

      test('should not allow deleting feeds', async () => {
        const { status, count } = await supabase.from('feeds').delete({ count: 'exact' }).match({
          url: feedList[0].url,
        });

        // No feeds are deleted
        expect(status).toBe(200);
        expect(count).toBe(0);
      });
    });
  });

  test.describe('Authenticated users through Seneca SSO', () => {
    const { email, firstName, lastName, displayName, githubAvatarUrl } = telescopeUser1;
    const accessToken = createToken(
      email,
      firstName,
      lastName,
      displayName,
      ['seneca', 'telescope'],
      githubAvatarUrl
    );
    const supabase = createClient(SUPABASE_URL, ANON_KEY);
    // Override the JWT on the public client
    supabase.auth.setAuth(accessToken);

    test.describe('"telescope_profiles" security policies', () => {
      test.beforeEach(() => createTelescopeUsers(users));

      test.afterEach(() => cleanupTelescopeUsers(users));

      test('should return all users', async () => {
        const { status, count } = await supabase
          .from('telescope_profiles')
          .select('id', { count: 'exact' });

        expect(status).toBe(200);
        expect(count).toBe(users.length);
      });

      test('should not allow creating new users', async () => {
        const { status } = await supabase.from('telescope_profiles').insert(
          {
            id: hash(unregisteredUser.email),
            email: unregisteredUser.email,
            first_name: unregisteredUser.firstName,
            last_name: unregisteredUser.lastName,
            display_name: unregisteredUser.displayName,
            github_username: unregisteredUser.githubUsername,
            github_avatar_url: unregisteredUser.githubAvatarUrl,
          },
          { returning: 'minimal' }
        );

        expect(status).toBe(401);
      });

      test('should allow users to update their own profiles', async () => {
        const { status, data: profiles } = await supabase
          .from('telescope_profiles')
          .update({ display_name: 'my name' }, { returning: 'representation' })
          .match({ id: hash(telescopeUser1.email) });

        expect(status).toBe(200);
        expect(profiles.length).toBe(1);
        expect(profiles[0].display_name).toBe('my name');
      });

      test("should not allow users to update others' profiles", async () => {
        const { status } = await supabase
          .from('telescope_profiles')
          .update({ display_name: 'my name' })
          .match({ id: hash(telescopeUser2.email) });

        expect(status).toBe(404);
      });

      test('should not allow deleting users', async () => {
        const { status, count } = await supabase
          .from('telescope_profiles')
          .delete({ count: 'exact' })
          .match({
            id: hash(telescopeUser1.email),
          });

        expect(status).toBe(200);
        expect(count).toBe(0);
      });
    });

    test.describe('"feeds" security policies', () => {
      // Create feeds for HansLippershey and an unregistered user
      test.beforeEach(async () => {
        await createTelescopeUsers([telescopeUser1]);
        await addFeeds(feedList);
      });

      test.afterEach(async () => {
        await cleanFeeds(feedList);
        await cleanupTelescopeUsers([telescopeUser1]);
      });

      test('should allow reading the feeds list', async () => {
        const { status, data } = await supabase.from('feeds').select();

        expect(status).toBe(200);
        expect(data).toEqual(
          expect.arrayContaining(
            feedList.map((feed) =>
              expect.objectContaining({
                url: feed.url,
              })
            )
          )
        );
      });

      test('should allow users to add feeds linked to their account', async () => {
        const { status, data: feeds } = await supabase.from('feeds').insert(
          {
            url: 'http://dev.to/devto',
            id: hash(normalizeUrl('http://dev.to/devto')),
            user_id: hash(telescopeUser1.email),
          },
          { returning: 'representation' }
        );

        expect(status).toBe(201);
        expect(feeds.length).toBe(1);
        expect(feeds[0].url).toBe('http://dev.to/devto');
      });

      test('should not allow users to add feeds not linked to their account', async () => {
        const { status } = await supabase.from('feeds').insert(
          {
            url: 'http://dev.to/devto',
            id: hash(normalizeUrl('http://dev.to/devto')),
            wiki_author_name: 'devto',
            user_id: hash(unregisteredUser.email),
          },
          { returning: 'minimal' }
        );

        expect(status).toBe(401);
      });

      test('should allow user to update their own feeds', async () => {
        const { status, data: feeds } = await supabase
          .from('feeds')
          .update({ type: 'youtube' }, { returning: 'representation' })
          .match({ url: telescopeUser1.feeds[0] });

        expect(status).toBe(200);
        expect(feeds.length).toBe(1);
        expect(feeds[0].type).toBe('youtube');
      });

      test("should not allow users to update others' feeds", async () => {
        const { status } = await supabase
          .from('feeds')
          .update({ type: 'youtube' })
          .match({ url: unregisteredUser.feeds[0] });

        expect(status).toBe(404);
      });

      test('should allow users to delete their own feeds', async () => {
        const { status, count } = await supabase.from('feeds').delete({ count: 'exact' }).match({
          url: telescopeUser1.feeds[0],
        });

        expect(status).toBe(200);
        expect(count).toBe(1);
      });

      test("should not allow users to delete others' feeds", async () => {
        const { status, count } = await supabase
          .from('feeds')
          .delete({ count: 'exact' })
          .match({ url: unregisteredUser.feeds[0] });

        // the request succeeds but no rows are deleted
        expect(status).toBe(200);
        expect(count).toBe(0);
      });
    });
  });
});
