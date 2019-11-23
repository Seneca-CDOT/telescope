// The goal is to create a function that given a html blog
// it will parse the URLs from that feed and return an array of urls
// Later on , you can then organize the types of urls (github etc)...
const getUrls = require('get-urls');
// this function returns an array of urls from the html
exports.extract = function(htmlData) {
  const urls = getUrls(htmlData);
  const arrayOfUrls = Array.from(urls);
  return arrayOfUrls;
};
