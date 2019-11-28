const storage = require('../src/backend/utils/storage');

describe('Tests for storage', () => {
  const feed = { name: 'James Smith', url: 'http://seneca.co/jsmith' };
  const feed2 = { name: 'James Smith 2', url: 'http://seneca.co/jsmith/2' };

  it('inserting a feed returns a feed id', async () => {
    const feedId = await storage.addFeed(feed.name, feed.url);
    expect(typeof feedId).toBe('number');
  });

  it('should allow retrieving a feed by id after inserting', async () => {
    const feedId = await storage.addFeed(feed2.name, feed2.url);
    const result = await storage.getFeed(feedId);
    expect(result).toEqual(feed2);
  });

  const post = {
    guid: 'tag:blogger.com,1999:blog-7100164112302197371.post-522285656016053350',
    author: 'Neil David',
    title: 'My First Blog',
    link: 'http://nadavid.blogspot.com/2008/09/my-first-blog.html',
    content:
      "I have never done this before, so let's make this short. This post is just a test on how my blog post will look like.",
    text: 'post one text',
    updated: Date('2009-09-07T22:23:00.544Z'),
    published: Date('2009-09-07T22:20:00.000Z'),
    url: 'http://seneca.co/jsmith',
    site: 'wordpress.com',
  };

  const post2 = {
    guid: '2tag:blogger.com,1999:blog-7100164112302197371.post-522285656016053350',
    author: 'Neil David2',
    title: 'My First Blog2',
    link: 'http://nadavid2.blogspot.com/2008/09/my-first-blog.html',
    content:
      "I have never done this before, so let's make this short. This post is just a test on how my blog post will look like.",
    text: 'post one text2',
    updated: Date('2008-09-07T22:12:00.544Z'),
    published: Date('2008-09-07T22:09:00.000Z'),
    url: 'http://seneca.co/jsmith',
    site: 'wordpress.com',
  };

  it('should allow retrieving a post by guid after inserting', async () => {
    await storage.addPost(post);
    const result = await storage.getPost(post.guid);
    expect(result.link).toEqual(post.link);
  });

  it('get all posts returns corrent number of posts', async () => {
    await storage.addPost(post2);
    const result = await storage.getPosts(post2.published, post.published);
    expect(result.length).toEqual(2);
  });

  it('get all posts returns sorted posts by date', async () => {
    const result = await storage.getPosts(post2.published, post.published);
    expect(result[0]).toEqual(post2.guid);
    expect(result[1]).toEqual(post.guid);
  });
});
