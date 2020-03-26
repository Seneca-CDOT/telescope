const express = require('express');
const healthcheck = require('express-healthcheck');
const gitRepoInfo = require('git-repo-info');

// We want the current version from package.json
const { version } = require('../../../../package.json');
// As well as the current git sha
const { sha } = gitRepoInfo();
// And a github URL to this commit
const gitHubUrl = `https://github.com/Seneca-CDOT/telescope/commit/${sha}`;

const router = express.Router();

router.use(
  '/',
  healthcheck({
    healthy: () => ({
      status: 'ok',
      info: {
        version,
        sha,
        gitHubUrl,
      },
    }),
  })
);

module.exports = router;
