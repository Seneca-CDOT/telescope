/* This file contains the code for counting the blog posts from different domains.
 * The module receives an array of blog urls and returns an array of json object in format
 * {name: domainName, count: number of frequency}
*/

//  import url library
const urls = require('url');

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
module.exports.blogDomainCounter = function (feedUrls) {
  const domainSummary = [];
  const { hostname } = urls.parse(feedUrls[0].url);
  domainSummary.push(
    createDomainObject(getDomain(hostname)),
  );

  /* When the domainSummary is empty, it will push the first object into this array,
  *  After the first object added, we don't need to check the first element again.
  */

  feedUrls.slice(1).forEach(({ url }) => {
    const currentDomainName = getDomain(urls.parse(url).hostname);
    const domainIndex = domainSummary.findIndex((domain) => domain.name === currentDomainName);
    if (domainIndex === -1) {
      domainSummary.push(
        createDomainObject(currentDomainName),
      );
    } else {
      domainSummary[domainIndex].count += 1;
    }
  });
  return domainSummary;
};
