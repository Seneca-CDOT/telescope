const puppeteer = require('puppeteer');
const { logger } = require('./logger');

let browser;
let page;

module.exports.initialize = function init() {
  return new Promise((resolve, reject) => {
    puppeteer
      .launch()
      .then(b => {
        browser = b;
        browser
          .newPage()
          .then(p => {
            page = p;
            resolve();
          })
          .catch(err => {
            logger.error({ err }, 'Failed to create new page');
            reject(err);
          });
      })
      .catch(err => {
        logger.error({ err }, 'Failed to launch new browser');
        reject(err);
      });
  });
};

module.exports.parse = function(htmlFragment, p = page) {
  return new Promise((resolve, reject) => {
    p.setContent(htmlFragment, {
      waitUntil: 'domcontentloaded',
    })
      .then(() => {
        p.evaluate('document.body.innerText')
          .then(result => {
            resolve(result);
          })
          .catch(err => {
            logger.error({ err }, 'Failed to evaluate html document');
            reject(err);
          });
      })
      .catch(err => {
        logger.error({ err }, 'Failed to set html content on page');
        reject(err);
      });
  });
};

module.exports.close = function() {
  return new Promise((resolve, reject) => {
    browser
      .close()
      .then(() => {
        resolve();
      })
      .catch(err => {
        logger.error({ err }, 'Failed to gracefully close browser instance');
        reject(err);
      });
  });
};
