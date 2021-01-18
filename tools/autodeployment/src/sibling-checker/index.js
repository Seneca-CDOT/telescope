/* eslint-disable no-use-before-define */
const fetch = require('node-fetch');
const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async/dynamic');

const server =
  process.env.DEPLOY_TYPE === 'production'
    ? 'https://telescope.cdot.systems/health.'
    : 'https://dev.telescope.cdot.systems/health.';

let timerOne;
let timerTwo;
let messageSent = false;

const firstCheck = () => {
  timerOne = setIntervalAsync(async () => {
    const result = await fetch(server, {
      method: 'head',
      timeout: 1500,
    });
    if (result.status !== 200) {
      clearIntervalAsync(timerOne);
      secondCheck();
    }
  }, process.env.INTERVAL_ONE);
};

const secondCheck = () => {
  timerTwo = setIntervalAsync(async () => {
    const result = await fetch(server, { method: 'head', timeout: 1500 });

    if (result.status !== 200 && !messageSent) {
      sendMessage(result.status);
      messageSent = true;
    }

    if (result.status === 200) {
      clearIntervalAsync(timerTwo);
      sendMessage(result.status);
      firstCheck();
      messageSent = false;
    }
  }, process.env.INTERVAL_TWO);
};

const sendMessage = async (status) => {
  const message = {
    blocks: [
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `* ${process.DEPLOY_TYPE.toUpperCase()} IS ${status === 200 ? 'BACK' : 'DOWN'}
          *\n\n`,
        },
        accessory: {
          type: 'image',
          image_url:
            status === 200
              ? 'https://data.whicdn.com/images/186936913/original.jpg'
              : 'https://64.media.tumblr.com/090e86896948354262566ddb906e514e/tumblr_mxrsfhStH61r62zwpo1_500.jpg',
          alt_text: 'alt text for image',
        },
      },
      {
        type: 'divider',
      },
    ],
  };

  await fetch(process.SLACK_WEBHOOK_URL, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
};

module.export = { firstCheck };
