// NOTE: you must mock the authentication provider where you require this:
// jest.mock('../src/backend/web/authentication');

const { init } = require('../../src/backend/web/authentication');

const defaultName = 'user1';
const defaultEmail = 'user1@example.com';

// Login as a regular user
module.exports.login = function (name, email, isAdmin = false) {
  init(name || defaultName, email || defaultEmail, isAdmin);
};

// Login as an Admin
module.exports.loginAdmin = function (name, email) {
  module.exports.login(name, email, true);
};

// Logout
module.exports.logout = function () {
  init();
};
