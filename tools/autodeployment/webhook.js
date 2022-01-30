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
 * GitHub's webhooks send 3 POST requests with different actions whenever a
 * release event takes place:
 *
 *  - created
 *  - published
 *  - released
 *
 * To prevent the autodeployment server from processing the 3 requests
 * (and eventually crashing), we need to ignore everything except 'published'.
 *
 * More information about release events here:
 * https://docs.github.com/en/actions/reference/events-that-trigger-workflows#release
 * The filter combines checking for staging or production build types and also
 * for the right type of action for a release event in production builds
 * @param {string} repo - Repository name (should be 'telescope')
 * @param {string} buildType - Build type: staging or production
 * @param {string} action - Action for a specific release event: created, published or released.
 * @param {string} ref - .Git reference resource.
 * @param {string} mainBranch - Brach used in the repo as main branch.
 */
function requestFilter(repo, buildType, action, ref, mainBranch) {
  const currentBranch = ref?.split('/').pop();

  return (
    // Check repo
    repo === REPO_NAME &&
    // Check if the reference is the branch used as main or if it is a tag
    (currentBranch === mainBranch || ref.includes('tags/')) &&
    // Check the build type and the action
    (buildType === 'staging' || (buildType === 'production' && action === 'published'))
  );
}

/**
 * Extract the commit for this GitHub payload, depending on the event type
 * @param {'push' | 'release'} eventType one of 'push' or 'release'
 * @param {Object} githubData webhook payload from GitHub, see https://github.com/Seneca-CDOT/telescope/settings/hooks
 */
function getSha(eventType, githubData) {
  if (eventType === 'push') {
    // "after": "adf299da6e6e9c3f20208ee6ab61d205a9f70eab",
    return githubData.after;
  }
  if (eventType === 'release') {
    // "target_commitish": "1a4594cfc443d307679576d9fdfa402f530a570c",
    return githubData.release.target_commitish;
  }
  logger.warn(`Unknown GitHub event type ${eventType}. Unable to parse git SHA`);
  return 'unknown';
}

/**
 * Create a handler for the particular GitHub push event and build type
 * @param {string} buildType - one of `production` or `staging`
 * @param {string} gitHubEvent - the GitHub Push Event name
 */
function handleEventType(buildType, gitHubEvent) {
  if (DEPLOY_TYPE !== buildType) {
    return;
  }

  /**
   * @otcokit/webhooks .on
   * https://github.com/octokit/webhooks.js#webhookson
   */
  webhooks.on(gitHubEvent, (event) => {
    const githubData = event.payload;

    if (
      requestFilter(
        githubData.repository.name,
        buildType,
        githubData.action,
        githubData.ref,
        githubData.repository.master_branch
      )
    ) {
      const sha = getSha(gitHubEvent, githubData);
      addBuild(buildType, githubData, sha);
    }
  });
}

// Production builds happen when GitHub sends us a `release` event
handleEventType('production', 'release');

// Staging builds happen when GitHub sends us a `push` event
handleEventType('staging', 'push');

module.exports.webhookHandler = router;
