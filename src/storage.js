//get config
require('./config');
//get redis constant searches redis globally 

const Redis = require('ioredis'); //chnage to ioredis
//connecting client
const client = new Redis(process.env.REDIS_URL);

//result from require, displays externally
module.exports = {
    addFeed: function(name, url, f) {
      const feed = { 'name': name, 'url': url }; //insted of json store id to a hash
      client.pipeline().incr('user_id').get('user_id', function(err, id) {
          if (err)
            f(err, id);
          else
            client.hset('feeds', id, JSON.stringify(feed), f); //transform json object into string and save to redis feeds
      }).exec();
    },

    //sends to read and waits for completion (async method)
    getFeeds: function(f) {
        client.hgetall('feeds', function(err, data) {
            if (typeof(data) != 'undefined') {
    //removes id from display
                result = [];
                for (var k in data)
                    result.push(JSON.parse(data[k]));
                data = result;
            }
            f(err, data);
        });
    }
}
