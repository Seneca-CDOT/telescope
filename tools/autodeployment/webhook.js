const { Router, logger } = require('@senecacdot/satellite');
const { Webhooks, createNodeMiddleware } = require('@octokit/webhooks');

const { addBuild } = require('./builds');

// Current build process output stream (if any)
const { SECRET, REPO_NAME, DEPLOY_TYPE } = process.env;

const router = Router();

// Process GitHub Push Event
const webhooks = new Webhooks({ secret: SECRET, log: logger });
webhooks.onError((error) => logger.error(error));

router.post('/', createNodeMiddleware(webhooks, { path: '/' }));

/**
 * @otcokit/webhooks .on
 * https://github.com/octokit/webhooks.js#webhookson
 */
webhooks.on('push', (event) => {
  const githubData = event.payload;
  const deployTag = githubData.data.deploy_tag;

  if (deployTag) {
    addBuild(deployTag, githubData, githubData.commit);
  }
});

module.exports.webhookHandler = router;
