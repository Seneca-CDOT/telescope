/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-expressions */
const fetch = require('node-fetch');
const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async/dynamic');

const server =
  process.DEPLOY_TYPE === 'production'
    ? 'https://telescope.cdot.systems/health.'
    : 'https://dev.telescope.cdot.systems/health.';

let timerOne;
let timerTwo;
let warningSign = false;

const firstCheck = () => {
  timerOne = setIntervalAsync(async () => {
    const result = await fetch(server, {
      method: 'head',
      timeout: 1500,
    });
    if (!result.status === 200) {
      clearIntervalAsync(timerOne);
      !warningSign ? secondCheck() : null;
      warningSign = true;
    }
  }, 120000);
};

const secondCheck = () => {
  timerTwo = setIntervalAsync(async () => {
    const result = await fetch(server, { method: 'head', timeout: 1500 });

    if (!result.status === 200 && warningSign) sendMessage(result.status);

    if (result.status === 200) {
      clearIntervalAsync(timerTwo);
      warningSign ? firstCheck() : null;
      warningSign = false;
    }
  }, 10000);
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

  await fetch(process.SLACK_SEND_MESSAGE, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
};
