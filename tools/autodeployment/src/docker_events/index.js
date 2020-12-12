/* eslint-disable no-unused-expressions */
const shell = require('shelljs');
const fetch = require('node-fetch');
const Events = require('events');

const { SLACK_SEND_MESSAGE } = process.env;

const dockerEvents = new Events.EventEmitter();

const server = process.DEPLOY_TYPE === 'production' ? 'PRODUCTION' : 'DEV';

const eventsDown = ['pause', 'die', 'stop'];
const eventsBack = ['start', 'unpause', 'restart'];

const containersUp = new Set();
const containersDown = new Set();

const message = (eventLog) => {
  const {
    status,
    Action,
    Actor: {
      Attributes: { name },
    },
  } = eventLog;

  const isDown = eventsDown.includes(Action);

  const logo = isDown
    ? 'https://www.iconsdb.com/icons/preview/red/warning-xxl.png'
    : 'https://www.iconsdb.com/icons/preview/green/up-circular-xxl.png';

  return {
    blocks: [
      {
        type: 'divider',
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `* ${server} DOCKER CONTAINER: ${
            isDown ? 'DOWN' : 'UP'
          }*\n\nContainer: ${name}\nAction: ${Action}\nCurrent Status: ${status}\n`,
        },
        accessory: {
          type: 'image',
          image_url: logo,
          alt_text: 'alt text for image',
        },
      },
      {
        type: 'divider',
      },
    ],
  };
};

const sendMessage = async (containerEvent) => {
  await fetch(SLACK_SEND_MESSAGE, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message(containerEvent)),
  });
};

const eventHandle = (containerEvent) => {
  const {
    Action,
    Actor: {
      Attributes: { name },
    },
  } = containerEvent;

  if (
    (containersDown.has(name) && eventsDown.includes(Action)) ||
    (containersUp.has(name) && eventsBack.includes(Action))
  )
    return;

  if (eventsDown.includes(Action)) {
    containersUp.has(name) ? containersUp.delete(name) : null;
    containersDown.add(name);
  } else {
    containersDown.has(name) ? containersDown.delete(name) : null;
    containersUp.add(name);
  }
  sendMessage(containerEvent);
};

const dockerListener = () => {
  const event = shell.exec('./docker-listener.sh', {
    silent: true,
    async: true,
  });
  event.stdout.on('data', (data) => {
    const containerEvent = JSON.parse(data);
    if (containerEvent.Actor.Attributes.name.includes('telescope')) {
      eventHandle(containerEvent);
    }
  });
};

dockerEvents.on('start', dockerListener);

const dockerMonitor = () => dockerEvents.emit('start');

module.exports = { dockerMonitor };
