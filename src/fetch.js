const fetch = require('node-fetch');
const createError = require('http-errors');

/*
 *  Creates a standardized fetch function that services can use when making http requests
 *  @param url {string}
 *  @param options {Object}
 *  @returns Promise<any>
 */
module.exports.Fetch = async (url, options = {}) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    return createError(response.status, `Could not reach ${url}`);
  }

  return response;
};
