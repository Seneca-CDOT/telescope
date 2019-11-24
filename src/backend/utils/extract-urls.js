/*
  This function returns an array of urls from the html or
  returns an empty array if there were no urls in the blog feed data
*/
const getUrls = require('get-urls');

exports.extract = function(htmlData) {
  const urls = getUrls(htmlData);
  const arrayOfUrls = Array.from(urls);
  return arrayOfUrls;
};
