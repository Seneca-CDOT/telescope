const { Router, logger, createError } = require('@senecacdot/satellite');
const Post = require('../data/post');
const { getPosts, getPostsCount } = require('../storage');
const { validatePostsQuery, validatePostsIdParam } = require('../validation');

const postsUrl = process.env.POSTS_URL || '/';

const posts = Router();

posts.get('/', validatePostsQuery(), async (req, res, next) => {
  const defaultNumberOfPosts = process.env.MAX_POSTS_PER_PAGE || 30;
  const capNumOfPosts = 100;
  const page = parseInt(req.query.page || 1, 10);
  const expand = req.query.expand ? parseInt(req.query.expand) : 0;
  let ids;
  let perPage;
  let postsCount;
  let from;
  let to;

  /**
   * Set 'perPage' to a value within the limits or
   * to default if per_page is not present
   */
  if (req.query.per_page)
    perPage = req.query.per_page > capNumOfPosts ? capNumOfPosts : req.query.per_page;
  else perPage = defaultNumberOfPosts;

  try {
    postsCount = await getPostsCount();

    /**
     * Set the range of posts that will be requested
     * {from, to}
     */
    from = perPage * (page - 1);
    // Make sure the upper limit is not higher than the total number of posts in the DB
    to = perPage * page > postsCount ? postsCount : perPage * page;

    ids = await getPosts(from, to);
  } catch (err) {
    logger.error({ err }, 'Unable to get posts from Redis');
    next(createError(503, 'Unable to connect to database'));
  }

  /**
   * Add prev, next, first and last in the response's header.
   * It's been implemented to work circularly.
   * Once reached the last set of posts, 'next' points at the first set.
   * Same case with 'prev' and the first set of posts.
   */
  const nextPage = to >= postsCount ? 1 : page + 1;
  const prevPage = from === 0 ? Math.floor(postsCount / perPage) : page - 1;

  res.set('X-Total-Count', postsCount);

  res.links({
    next: `/posts?per_page=${perPage}&page=${nextPage}`,
    prev: `/posts?per_page=${perPage}&page=${prevPage}`,
    first: `/posts?per_page=${perPage}&page=${1}`,
    last: `/posts?per_page=${perPage}&page=${Math.floor(postsCount / perPage)}`,
  });
  let data;
  if (expand === 1) {
    data = await Promise.all(
      ids.map(async (id, title, published) => {
        let post = await Post.byId(id); //obtain the corresponding feed to populate the author's name to the return data.
        return {
          id,
          url: `${postsUrl}/${id}`,
          author: post.feed.author,
          title: post.title,
          publishDate: post.published,
        };
      })
    );
  } else
    data = ids
      // Return id and url for a specific post
      .map((id) => ({ id, url: `${postsUrl}/${id}` }));
  res.json(data);
});

posts.get('/:id', validatePostsIdParam(), async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await Post.byId(id);

    // If the object we get back is empty, use 404
    if (!post) {
      res.status(404).json({
        message: `Post not found for id ${id}`,
      });
    } else {
      switch (req.accepts(['json', 'text', 'html'])) {
        case 'json':
          res.append('Content-type', 'application/json').json(post);
          break;
        case 'text':
          res.append('Content-type', 'text/plain').send(post.text);
          break;
        case 'html':
          res.append('Content-type', 'text/html').send(post.html);
          break;
        default:
          res.status(406).json({
            message: 'Invalid content type',
          });
          break;
      }
    }
  } catch (err) {
    logger.error({ err }, 'Unable to get posts from Redis');
    next(createError(503, 'Unable to connect to database'));
  }
});

module.exports = posts;
