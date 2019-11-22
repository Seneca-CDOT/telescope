/* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
// the sortUrlsByType() takes an array of URLs, and a search term
// this function should return only the URL type that was specified from the searchTerm
exports.sortUrlsByType = function(UrlArray, searchTerm) {
  let j = 0;
  let i;
  const githubArray = [];
  for (i = 0; i < UrlArray.length; i++) {
    if (UrlArray[i].substring(0, 18) === searchTerm) {
      githubArray[j] = UrlArray[i];
      j += 1;
    }
  }
  return githubArray;
};
