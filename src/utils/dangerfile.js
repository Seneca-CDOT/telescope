const { danger, warn } = require('danger');
const { includes } = require('lodash');

const apps = includes(danger.git.fileMatch, '../*.js');
const tests = includes(danger.git.fileMatch, '../../test/*.test.js');

if (apps.modified && !tests.modified) {
  const message = `Changes were made to file in src, but not to the test file folder`;
  const idea = `Perhaps check if tests for the src file needs to be changed?`;
  warn(`${message} - <i>${idea}</i>`);
}
