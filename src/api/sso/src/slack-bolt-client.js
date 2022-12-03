const { logger } = require('@senecacdot/satellite');
const { App } = require('@slack/bolt');

const { SLACK_BOT_CHANNEL_ID } = process.env;

const createSlackApp = () => {
  const { SLACK_BOT_TOKEN, SLACK_BOT_SIGNING_SECRET } = process.env;
  if (!(SLACK_BOT_TOKEN && SLACK_BOT_SIGNING_SECRET && SLACK_BOT_CHANNEL_ID)) {
    logger.info('Skipping Slack Bot integration, not configured');
    return false;
  }

  const app = new App({
    token: SLACK_BOT_TOKEN.trim(),
    signingSecret: SLACK_BOT_SIGNING_SECRET.trim(),
  });

  return app;
};

const constructMessageBlocks = (displayName, githubUsername, blogUrl) => {
  const messageBlocks = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        emoji: true,
        text: 'New Member Notification :tada:',
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'context',
      elements: [
        {
          type: 'image',
          image_url: `https://github.com/${githubUsername}.png?size=64`,
          alt_text: 'avatar',
        },
        {
          type: 'mrkdwn',
          text: `*${displayName}* has joined the Telescope community. Be the first one to welcome them.`,
        },
        {
          type: 'mrkdwn',
          text: `<https://www.github.com/${githubUsername} | *Visit Github Profile*>`,
        },
        {
          type: 'mrkdwn',
          text: `<${blogUrl} | *Visit Blog*>`,
        },
      ],
    },
  ];
  return messageBlocks;
};

const publishSignUpMessage = async (displayName, githubUsername, blogUrl) => {
  if (!(displayName && githubUsername && blogUrl))
    throw new Error(
      'displayName, gitHubUsername, and blogUrl are required to send sign up announcement'
    );
  const app = createSlackApp();
  if (app) {
    try {
      const messageBlocks = constructMessageBlocks(displayName, githubUsername, blogUrl);

      const result = await app.client.chat.postMessage({
        channel: SLACK_BOT_CHANNEL_ID.trim(),
        text: `${displayName} has joined the Telescope community. Be the first one to welcome them.`,
        blocks: messageBlocks,
        unfurl_links: false,
      });
      logger.debug({ result }, 'Slack Bot message delivery successful');
    } catch (error) {
      logger.warn({ error }, 'Slack Bot message delivery unsuccessful');
    }
  }
};

module.exports = publishSignUpMessage;
