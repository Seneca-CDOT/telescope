const jsdom = require('jsdom');

const { JSDOM } = jsdom;

module.exports.parser = () => {
  const { window } = new JSDOM();
  return new window.DOMParser();
};
