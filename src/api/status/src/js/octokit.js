const { Octokit } = require('@octokit/core');
const { retry } = require('@octokit/plugin-retry');
const { throttling } = require('@octokit/plugin-throttling');

const MyOctokit = Octokit.plugin(retry, throttling);
const octokit = new MyOctokit({
  auth: process.env.GITHUB_TOKEN,
  // options for throttling plugin https://github.com/octokit/plugin-throttling.js
  throttle: {
    onRateLimit: (retryAfter, options, octokitClient) => {
      octokitClient.log.warn(
        `Request quota exhausted for request ${options.method} ${options.url}`
      );

      if (options.request.retryCount === 0) {
        // only retries once
        octokitClient.log.info(`Retrying after ${retryAfter} seconds!`);
        // Return true to automatically retry the request after retryAfter seconds.
        return true;
      }

      return false;
    },
    onAbuseLimit: (retryAfter, options, octokitClient) => {
      // does not retry, only logs a warning
      octokitClient.log.warn(`Abuse detected for request ${options.method} ${options.url}`);
    },
  },
});

module.exports = octokit;
