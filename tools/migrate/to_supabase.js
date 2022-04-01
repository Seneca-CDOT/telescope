const { createClient } = require('@supabase/supabase-js');
const { parsePlanetFeedList } = require('./feed');

require('dotenv').config();

const { SUPABASE_URL, SERVICE_ROLE_KEY } = process.env;

(async () => {
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    console.error('Environment variables are not set to migrate feeds to supabase');
    console.error('SUPBASE_URL or SERVICE_ROLE_KEY is missing');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const planetUsers = await parsePlanetFeedList();

  const feeds = planetUsers.map(({ feed, firstName, lastName }) => ({
    url: feed,
    wiki_author_name: `${firstName} ${lastName}`,
    type: 'blog',
  }));

  const { error, count } = await supabase.from('feeds').upsert(feeds, {
    // Replace the existing url if exists
    onConflict: 'url',
    count: 'exact',
    returning: 'minimal',
  });

  if (error) {
    console.error('Failed to migrage planet feed list to Supabase');
    console.error(`Supabase Error: `, error);
    process.exit(1);
  }

  console.log(`Migrated ${count} users to supabase-db`);
})();
