const { logger } = require('@senecacdot/satellite');
const hash = require('@senecacdot/satellite/src/hash');
const { PrismaClient } = require('@prisma/client');
const normalizeUrl = require('normalize-url');

const { SUPABASE_URL, SERVICE_ROLE_KEY } = process.env;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: SUPABASE_URL,
    },
  },
});

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  logger.error('SUPABASE_URL or SERVICE_ROLE_KEY is missing');
  process.exit(1);
}

module.exports = {
  async getAllFeeds() {
    try {
      const data = await prisma.feeds.findMany({
        select: {
          wiki_author_name: true,
          url: true,
          telescope_profiles: { select: { display_name: true, github_username: true } },
        },
      });

      return data.map((feed) => ({
        // Prefer the a user's display name if present, fallback to wiki name otherwise
        author: feed.telescope_profiles?.display_name || feed.wiki_author_name,
        url: feed.url,
        githubUsername: feed.telescope_profiles?.github_username,
      }));
    } catch (e) {
      logger.error({ e });
      throw Error(e.message, "can't fetch feeds from db");
    }
  },

  // Invalid feed related functions
  async setInvalidFeed(id) {
    try {
      await prisma.feeds.update({
        where: { id },
        data: { invalid: true },
      });
    } catch (e) {
      logger.error({ e });
      throw Error(e.message, `can't invalidate feed ${id} in db`);
    }
  },

  async getInvalidFeeds() {
    try {
      const invalidFeeds = await prisma.feeds.findMany({
        where: { invalid: true },
      });
      return invalidFeeds;
    } catch (e) {
      logger.error({ e });
      throw Error(e.message, "can't fetch invalid feeds in db");
    }
  },

  async isInvalid(id) {
    try {
      const invalidFeed = await prisma.feeds.findUnique({
        select: { invalid: true },
        where: { id },
      });
      return invalidFeed.invalid;
    } catch (e) {
      logger.error({ e });
      throw Error(e.message, `can't fetch feed ${id} from db`);
    }
  },

  // Flagged feed related functions
  async setFlaggedFeed(id) {
    try {
      await prisma.feeds.update({
        where: { id },
        data: { flagged: true },
      });
    } catch (e) {
      logger.error({ e });
      throw Error(e.message, `can't flag feed ${id} in db`);
    }
  },

  async unsetFlaggedFeed(id) {
    try {
      await prisma.feeds.update({
        where: { id },
        data: { flagged: false },
      });
    } catch (e) {
      logger.error({ e });
      throw Error(e.message, `can't unflag feed ${id} in db`);
    }
  },

  async getFlaggedFeeds() {
    try {
      const flaggedFeeds = await prisma.feeds.findMany({
        where: { flagged: true },
      });
      return flaggedFeeds.map((feed) => feed.id);
    } catch (e) {
      logger.error({ e });
      throw Error(e.message, "can't flagged feeds from db");
    }
  },

  async isFlagged(id) {
    try {
      const flaggedFeed = await prisma.feeds.findUnique({
        select: { flagged: true },
        where: { id },
      });
      return flaggedFeed.flagged;
    } catch (e) {
      logger.error({ e });
      throw Error(e.message, `can't fetch feed ${id} from db`);
    }
  },

  async addFeeds(feeds) {
    try {
      await prisma.feeds.createMany({
        data: [
          ...feeds.map((feed) => ({
            url: feed.url,
            id: hash(normalizeUrl(feed.url)),
            wiki_author_name: feed.author,
            invalid: false,
            flagged: false,
            type: 'blog',
            html_url: null,
            user_id: null,
          })),
        ],
      });
    } catch (e) {
      if (e) {
        logger.error({ e });
        throw Error(e.message, "can't insert feeds to supabase");
      }
    }
  },
};
