const { logger, fetch } = require('@senecacdot/satellite');
const { createClient } = require('@supabase/supabase-js');

const { SERVICE_ROLE_KEY, SUPABASE_URL, POSTS_URL } = process.env;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Format a Date into a String like `Saturday, September 17, 2016`
const formatDate = (date) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

// Group posts according to day, channel, date.
const getPostDataGrouped = (posts) => {
  // We group the posts into nested objects: days > authors > posts
  const grouped = { days: {} };

  posts?.forEach((post) => {
    if (!post) {
      return;
    }

    // Top level is formatted Day strings
    post.updated = new Date(post.updated);
    const formatted = formatDate(post.updated);
    if (!grouped.days[formatted]) {
      grouped.days[formatted] = {};
    }

    // Days contain Author strings
    const day = grouped.days[formatted];
    if (!day[post.feed.author]) {
      day[post.feed.author] = {};
    }

    // Authors contain guid strings, which are references to post Objects
    const author = day[post.feed.author];
    if (!author[post.guid]) {
      author[post.guid] = post;
    }
  });

  return grouped;
};

// Sort by author name
const sort = (feeds) => {
  return feeds?.sort((a, b) => {
    if (a.author < b.author) return -1;
    if (a.author > b.author) return 1;
    return 0;
  });
};

module.exports.getPosts = async () => {
  try {
    const response = await fetch(POSTS_URL);
    const posts = await response.json();
    return Promise.all(
      posts.map((item) =>
        fetch(item.url).then((r) => {
          if (!r.ok) {
            throw new Error(`unable to get post ${item.id}`);
          }
          return r.json();
        })
      )
    ).then(getPostDataGrouped);
  } catch (err) {
    return logger.error({ err }, 'Error getting posts');
  }
};

module.exports.getFeeds = async () => {
  const { data, error } = await supabase
    .from('feeds')
    .select('wiki_author_name, url, telescope_profiles (display_name)');

  if (error) {
    logger.warn({ error });
    throw Error(error.message, "can't fetch feeds from supabase");
  }

  return sort(
    data.map((feed) => ({
      // Prefer the a user's display name if present, fallback to wiki name otherwise
      author: feed.telescope_profiles?.display_name || feed.wiki_author_name,
      url: feed.url,
    }))
  );
};
