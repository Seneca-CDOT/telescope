const redismock = require('redis-mock');

process.env.REDIS_URL = 'redis://127.0.0.1:3679';

// const storage = require('../src/storage');

describe('Tests for storage', () => {
  const feed = { name: 'James Smith', url: 'http://seneca.co/jsmith' };
  it('insert new value first time', (done) => {
    const r = redismock.createClient('redis://127.0.0.1:3679');
    r.on('connect', (msg) => {
      expect(msg).toBe('123');
    });
    r.on('error', (err) => {
      expect(err).toBe('123');
    });
    // storage.addFeed(feed.name, feed.url).then(() => {
    const x = () => {
      r.get('1000', (err, result) => {
        expect(err).toBe(null);
        expect(result).toBe(feed);
        r.end();
        done();
      });
    };
    x();
    // });
  });
});


// insert new without hashes
/*
test('', async () => {
  // expect(process.env.redis).toBe();
  const feed = { name: 'James Smith', url: 'http://seneca.co/jsmith' };
  let addedFeed;
  await storage.addFeed(feed.name, feed.url);
  await client.get('1000', (err, value) => {
    addedFeed = JSON.parse(value);
    expect(value).toBe(feed);
  });
  client.end();
  expect(addedFeed).toBe(feed);
});
*/

// insert new with hash

// get all members

// get one member
