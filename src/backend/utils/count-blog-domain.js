/* This file contains the code for counting the blog posts from different domains.
 * The module receives an array of blog urls and returns an array of json object in format
 * {name: domainName, count: number of frequency}
 */

//  import url library
const url = require('url');

//  import logger
const { logger } = require('./logger');

const log = logger.child({ module: 'count-blog-domain' });

/*  getDomain() is used to get the domain from hostname without username.
 *   It will split the hostname that pass in, if there is only two parts,
 *   then it will return the hostname;
 *   if not, it will remove the first part.
 */
function getDomain(hostname) {
  const hostNameCounter = hostname.split('.').length;
  const domain = hostname.substring(hostname.indexOf('.') + 1);
  if (hostNameCounter === 2) {
    return hostname;
  }
  return domain;
}

/* createDomainObject() will create an object if it's not exist */
function createDomainObject(domainName) {
  return { name: domainName, count: 1 };
}

/* it will return object array: {name: domainName, count: numberOfDomain} */
module.exports.blogDomainCounter = function(feedUrls) {
  const domainSummary = [];
  /* When the domainSummary[] is empty,the first object must be pushed into the array,
   * it doesn''t need to check is it exist or not.
   */

  if (feedUrls.length !== 0) {
    //  check the feedUrls is empty or not
    const { hostname } = url.parse(feedUrls[0].url);
    domainSummary.push(createDomainObject(getDomain(hostname)));

    /* feedUrls.slice(1) used to get rid of the first object
     *  cause it was pushed into domainSummary when it's empty
     */

    feedUrls.slice(1).forEach(feedUrl => {
      try {
        const currentDomainName = getDomain(url.parse(feedUrl.url).hostname);
        const domainIndex = domainSummary.findIndex(domain => domain.name === currentDomainName);
        if (domainIndex === -1) {
          domainSummary.push(createDomainObject(currentDomainName));
        } else {
          domainSummary[domainIndex].count += 1;
        }
      } catch (err) {
        log.error(err);
      }
    });
  }
  return domainSummary;
};
