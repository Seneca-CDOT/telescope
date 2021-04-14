// NOTE: this should really live in src/api/auth but jest-playwright doesn't
// seen to know how to find it if I put it there.  It has to be at the root.
module.exports = {
  launchOptions: {
    // NOTE: if you need to debug, change these so you can see the browsers running
    // and slow them down, so there is time to read error messages:
    // headless: false,
    // slowMo: 1000,
    headless: true,
  },
  browsers: ['chromium', 'firefox', 'webkit'],
};
