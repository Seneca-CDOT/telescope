const { logger } = require('@senecacdot/satellite');
const { createClient } = require('@supabase/supabase-js');

const { SUPABASE_URL, SERVICE_ROLE_KEY } = process.env;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  logger.error('SUPBASE_URL or SERVICE_ROLE_KEY is missing');
  process.exit(1);
}

module.exports = {
  async getAllFeeds() {
    const { data, error } = await supabase
      .from('feeds')
      .select('wiki_author_name, url, telescope_profiles (display_name)');

    if (error) {
      logger.error({ error });
      throw Error(error.message, "can't fetch feeds from supabase");
    }

    return data.map((feed) => ({
      // Prefer the a user's display name if present, fallback to wiki name otherwise
      author: feed.display_name || feed.wiki_author_name,
      url: feed.url,
    }));
  },
};
