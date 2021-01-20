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
              ? 'https://images.unsplash.com/photo-1535635790206-6960f6eaacff?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1234&q=80'
              : 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2515&q=80',
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
