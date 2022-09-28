const { logger } = require('@senecacdot/satellite');
const hash = require('@senecacdot/satellite/src/hash');
const { createClient } = require('@supabase/supabase-js');
const normalizeUrl = require('normalize-url');

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
      author: feed.telescope_profiles?.display_name || feed.wiki_author_name,
      url: feed.url,
    }));
  },

  // Invalid feed related functions
  async setInvalidFeed(id) {
    const { error } = await supabase.from('feeds').update({ invalid: true }).eq('id', id);

    if (error) {
      logger.error({ error });
      throw Error(error.message, `can't invalidate feed ${id} in supabase`);
    }
  },

  async getInvalidFeeds() {
    const { data: invalidFeeds, error } = await supabase.from('feeds').select().is('invalid', true);
    if (error) {
      logger.error({ error });
      throw Error(error.message, "can't fetch invalid feeds in supabase");
    }
    return invalidFeeds;
  },
  async isInvalid(id) {
    const { data: invalidFeed, error } = await supabase
      .from('feeds')
      .select('invalid')
      .eq('id', id)
      .limit(1);

    if (error) {
      logger.error({ error });
      throw Error(error.message, `can't fetch feed ${id} from supabase`);
    }
    return invalidFeed.invalid;
  },

  // Flagged feed related functions
  async setFlaggedFeed(id) {
    const { error } = await supabase.from('feeds').update({ flagged: true }).eq('id', id);

    if (error) {
      logger.error({ error });
      throw Error(error.message, `can't flag feed ${id} in supabase`);
    }
  },
  async unsetFlaggedFeed(id) {
    const { error } = await supabase.from('feeds').update({ flagged: false }).eq('id', id);

    if (error) {
      logger.error({ error });
      throw Error(error.message, `can't unflag feed ${id} in supabase`);
    }
  },
  async getFlaggedFeeds() {
    const { data: flaggedFeeds, error } = await supabase.from('feeds').select().eq('flagged', true);

    if (error) {
      logger.error({ error });
      throw Error(error.message, `can't flagged feeds from supabase`);
    }
    return flaggedFeeds.map((feed) => feed.id);
  },
  async isFlagged(id) {
    const { data: flaggedFeed, error } = await supabase
      .from('feeds')
      .select('flagged')
      .eq('id', id)
      .limit(1);

    if (error) {
      logger.error({ error });
      throw Error(error.message, `can't fetch feed ${id} from supabase`);
    }
    return flaggedFeed.flagged;
  },
  async addFeeds(feeds) {
    const { error } = await supabase.from('feeds').insert(
      feeds.map((feed) => ({
        url: feed.url,
        id: hash(normalizeUrl(feed.url)),
        wiki_author_name: feed.author,
        invalid: false,
        flagged: false,
        type: 'blog',
        html_url: null,
        user_id: null,
      }))
    );
    if (error) {
      logger.error({ error });
      throw Error(error.message, "can't insert feeds to supabase");
    }
  },
};
