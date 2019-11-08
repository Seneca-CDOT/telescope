const bent = require('bent');
const fs = require('fs');
const feedQueue = require('./feed-queue');

const request = bent('string');

exports.start = function () {
  // clears data in data.xml for writing
  fs.writeFileSync('tempData.xml', '');
  // Start processing jobs from the feed queue...
  feedQueue.process(async (job) => {
    const { url } = job.data;
    console.log(`Processing job - ${url}`);
    // For now, just get the feed data and dump to /temp/data.xml
    return request(url).then((data) => {
      try {
        fs.appendFileSync('tempData.xml', data);
      } catch (err) {
        console.error(err);
        throw (err);
      }
    });
  });
};
