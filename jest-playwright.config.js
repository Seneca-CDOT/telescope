// NOTE: this should really live in src/api/auth but jest-playwright doesn't
// seen to know how to find it if I put it there.  It has to be at the root.
module.exports = {
  launchOptions: {
    headless: true,
  },
  browsers: ['chromium', 'firefox', 'webkit'],
  serverOptions: {
    command: 'npx http-server src/api/auth/test/e2e -p 8888',
    port: 8888,
    launchTimeout: 30000,
    usedPortAction: 'kill',
    debug: true,
  },
};
