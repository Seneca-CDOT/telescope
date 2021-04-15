const fetch = require('node-fetch');
const { hash, createServiceToken } = require('@senecacdot/satellite');

const USERS_URL = 'http://localhost/v1/users';

// takes a user object, performs GET using the user's email
const getUser = (user) =>
  fetch(`${USERS_URL}/${hash(user.email)}`, {
    headers: {
      Authorization: `bearer ${createServiceToken()}`,
      'Content-Type': 'application/json',
    },
  });

// constructs a paginated query using a passed string
const getUsersPaginated = (query = '') =>
  fetch(`${USERS_URL}/${query}`, {
    headers: {
      Authorization: `bearer ${createServiceToken()}`,
      'Content-Type': 'application/json',
    },
  });

// takes an array of users and sequentially gets them all
// not to be confused with getting users via pagination
const getUsers = (users) => Promise.all(users.map((user) => getUser(user)));

const createUsers = (numberOfUsers, sorted = false) => {
  let users = [...Array(numberOfUsers).keys()].map((index) => {
    return {
      firstName: `TelescopeUser${index}`,
      lastName: `TelescopeUser${index}`,
      email: `TelescopeUser${index}@email.com`,
      hash: hash(`TelescopeUser${index}@email.com`),
      displayName: `TelescopeUser${index} TelescopeUser${index}`,
      isAdmin: false,
      isFlagged: false,
      feeds: [`https://dev.to/feed/TelescopeUser${index}`],
      github: {
        username: `TelescopeUser${index}`,
        avatarUrl:
          'https://avatars.githubusercontent.com/u/7242003?s=460&u=733c50a2f50ba297ed30f6b5921a511c2f43bfee&v=4',
      },
    };
  });

  if (sorted) {
    users.sort((a, b) => {
      if (a.hash > b.hash) return 1;
      if (a.hash < b.hash) return -1;
      return 0;
    });
  }

  return users.map((user) => {
    delete user.hash;
    return user;
  });
};

const postUser = (user) =>
  fetch(`${USERS_URL}/${hash(user.email)}`, {
    method: 'post',
    headers: {
      Authorization: `bearer ${createServiceToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

const postUsers = (users) =>
  Promise.all(
    users.map((user) =>
      postUser(user)
        .then((res) => {
          // We should get a 201 (created), but if the user exists, a 409 (which is fine here)
          if (!(res.status === 201 || res.status === 409)) {
            throw new Error(`got unexpected status ${res.status}`);
          }
        })
        .catch((err) => {
          console.error('Unable to create user with Users service', { err });
        })
    )
  );

// Delete the Telescope users we created in the Users service.
const putUser = (user) =>
  fetch(`${USERS_URL}/${hash(user.email)}`, {
    method: 'put',
    headers: {
      Authorization: `bearer ${createServiceToken()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

// Delete the Telescope users we created in the Users service.
const deleteUser = (user) =>
  fetch(`${USERS_URL}/${hash(user.email)}`, {
    method: 'delete',
    headers: {
      Authorization: `bearer ${createServiceToken()}`,
    },
  });

// Delete the Telescope users we created in the Users service.
const deleteUsers = (users) => Promise.all(users.map((user) => deleteUser(user)));

module.exports.USERS_URL = USERS_URL;
module.exports.getUser = getUser;
module.exports.getUsers = getUsers;
module.exports.getUsersPaginated = getUsersPaginated;
module.exports.createUsers = createUsers;
module.exports.postUser = postUser;
module.exports.postUsers = postUsers;
module.exports.putUser = putUser;
module.exports.deleteUser = deleteUser;
module.exports.deleteUsers = deleteUsers;
