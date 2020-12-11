const shell = require('shelljs');
const fetch = require('node-fetch');
const Events = require('events');

const { SLACK_SEND_MESSAGE } = process.env;

const dockerEvents = new Events.EventEmitter();

const server = process.DEPLOY_TYPE === 'production' ? 'PRODUCTION' : 'DEV';

const message = {
  down: {
    response_type: 'in_channel',
    text: `\n:rotating_light: PRODUCTION IS DOWN. :rotating_light:\n`,
    attachments: [
      {
        text: `PROD IS DOWN`,
      },
    ],
  },
  up: {
    response_type: 'in_channel',
    text: `\nPRODUCTION IS BACK\n`,
    attachments: [
      {
        text: `PROD IS UP!\n`,
      },
    ],
  },
};

const waitingDocker = () => {
  const event = shell.exec('./waitDocker.sh', { silent: true, async: true });
  event.stdout.on('data', async () => {
    await fetch(SLACK_SEND_MESSAGE, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message.up),
    });
    dockerEvents.emit('start');
  });
};

const dockerListener = () => {
  const event = shell.exec('./failCheck.sh', { silent: true, async: true });
  event.stdout.on('data', async () => {
    await fetch(SLACK_SEND_MESSAGE, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message.down),
    });
    dockerEvents.emit('docker-down');
  });
};

dockerEvents.on('start', dockerListener);
dockerEvents.on('docker-down', waitingDocker);

const dockerMonitor = () => dockerEvents.emit('start');

module.exports = { dockerMonitor };
