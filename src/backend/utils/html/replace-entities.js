const entities = require('entities');

module.exports = function (dom, codeBlock) {
  // decode twice
  const result = entities.decodeHTML(codeBlock);
  return entities.decodeHTML(result);
};
