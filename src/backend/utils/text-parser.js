const puppeteer = require('puppeteer');

module.exports = async function(htmlFragment) {
  let browser;
  try {
    browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlFragment, {
      waitUntil: 'domcontentloaded',
    });

    const result = await page.evaluate('document.body.innerText');
    return result;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};
