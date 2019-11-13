const bent = require('bent');
const feedQueue = require('./feed-queue');

const request = bent('string');

exports.start = function () {
  // Start processing jobs from the feed queue...
  feedQueue.process(async (job) => {
    const { url } = job.data;
    console.log(`Processing job - ${url}`);
    // For now, just get the feed data and dump to the console
    return request(url).then((data) => console.log(`${data} + '\n\n'`)).catch((err) => { throw err; });
  });
};
