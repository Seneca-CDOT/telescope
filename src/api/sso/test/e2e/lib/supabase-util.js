const { expect } = require('@playwright/test');
const { createClient } = require('@supabase/supabase-js');
const { hash } = require('@senecacdot/satellite');
const normalizeUrl = require('normalize-url');

const { SUPABASE_URL, SERVICE_ROLE_KEY } = process.env;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const createTelescopeUsers = (users) =>
  supabase
    .from('telescope_profiles')
    .insert(
      users.map((user) => ({
        id: hash(user.email),
        email: user.email,
        first_name: user.firstName,
        last_name: user.lastName,
        display_name: user.displayName,
        github_username: user.githubUsername,
        github_avatar_url: user.githubAvatarUrl,
      })),
      { returning: 'minimal' }
    )
    .then((result) => {
      if (result.error) {
        throw new Error(`unable to insert user into Supabase: ${result.error.message}`);
      }
      return result;
    });

// Delete the Telescope users we created in the postgres DB.
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

// Given an array of users, make sure they all exist in the postgres DB
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

const addFeeds = (feeds) =>
  supabase
    .from('feeds')
    .insert(
      feeds.map((feed) => ({
        url: feed.url,
        id: hash(normalizeUrl(feed.url)),
        wiki_author_name: feed.wikAuthorName,
        ...(feed.userId ? { user_id: feed.userId } : {}),
      })),
      { returning: 'minimal' }
    )
    .then((result) => {
      if (result.error) {
        throw new Error(`unable to insert feeds into Supabase: ${result.error.message}`);
      }
      return result;
    });

const cleanFeeds = (feeds) =>
  Promise.all(
    feeds.map((feed) =>
      supabase
        .from('feeds')
        .delete()
        .match({ url: feed.url })
        .then((result) => {
          if (result.error) {
            throw new Error(`unable to delete feed from Supabase: ${result.error.message}`);
          }
          return result;
        })
    )
  );

module.exports.createTelescopeUsers = createTelescopeUsers;
module.exports.cleanupTelescopeUsers = cleanupTelescopeUsers;
module.exports.ensureUsers = ensureUsers;
module.exports.addFeeds = addFeeds;
module.exports.cleanFeeds = cleanFeeds;
