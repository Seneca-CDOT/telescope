const LinkHeader = require('http-link-header');

const { USERS_URL } = process.env;

module.exports.addNextLinkHeader = function (res, users, perPage) {
  // If there aren't any results, there's no "next" page to get
  if (!users.length) {
    return;
  }

  // Similarly, if the number of users is less than the perPage size,
  // don't bother adding a next link, since there aren't going to be more.
  if (users.length < perPage) {
    return;
  }

  // Get the id of the last user in this page of results
  const lastUser = users[users.length - 1];
  const lastId = lastUser.id;

  // Construct the body of the header, giving the URI to use for the next page:
  // '<https://api.telescope.cdot.systems/v1/users?start_after=6Xoj0UXOW3&per_page=100>; rel="next"'
  const link = new LinkHeader();
  link.refs.push({ uri: `${USERS_URL}?start_after=${lastId}&per_page=${perPage}`, rel: 'next' });

  res.set('Link', link.toString());
};
