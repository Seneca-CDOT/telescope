const fetch = require('node-fetch');

const stagingHost = 'https://dev.api.telescope.cdot.systems';
const prodHost = 'https://api.telescope.cdot.systems';
const apiVersion = 'v1';

const stagingUrl = (pathname) => `${stagingHost}/${apiVersion}${pathname}`;
const prodUrl = (pathname) => `${prodHost}/${apiVersion}${pathname}`;

// Our current list of microservices
const services = [
  {
    name: 'auth',
    staging: stagingUrl('/auth/healthcheck'),
    production: prodUrl('/auth/healthcheck'),
  },
  {
    name: 'image',
    staging: stagingUrl('/image/healthcheck'),
    production: prodUrl('/image/healthcheck'),
  },
  {
    name: 'posts',
    staging: stagingUrl('/posts/healthcheck'),
    production: prodUrl('/posts/healthcheck'),
  },
  {
    name: 'feed-discovery',
    staging: stagingUrl('/feed-discovery/healthcheck'),
    production: prodUrl('/feed-discovery/healthcheck'),
  },
  {
    name: 'user',
    staging: stagingUrl('/users/healthcheck'),
    production: prodUrl('/users/healthcheck'),
  },
  {
    name: 'search',
    staging: stagingUrl('/search/healthcheck'),
    production: prodUrl('/search/healthcheck'),
  },
  {
    name: 'telescope',
    staging: 'https://dev.telescope.cdot.systems',
    production: 'https://telescope.cdot.systems',
  },
];

async function checkService(service) {
  async function healthCheck(url) {
    try {
      const res = await fetch(url, { method: 'head' });
      return res.status;
    } catch (err) {
      return 500;
    }
  }

  const [stagingStatus, productionStatus] = await Promise.all([
    healthCheck(service.staging),
    healthCheck(service.production),
  ]);

  return {
    ...service,
    status: {
      staging: stagingStatus,
      production: productionStatus,
    },
  };
}

module.exports.check = function () {
  return Promise.all(services.map((service) => checkService(service)));
};
