const { ELASTIC_URL, ELASTIC_PORT } = process.env;
const { Client } = require('@elastic/elasticsearch');
const Mock = require('@elastic/elasticsearch-mock');
const logger = require('./logger');

let mock;

function MockClient() {
  const client = new Client({
    node: 'http://localhost:9200',
    Connection: mock.getConnection(),
  });
  // Provide a fake health check
  client.cluster.health = () => Promise.resolve();

  return client;
}

// elasticUrl will either come from the ENV or will be defined locally
const elasticUrl = `${ELASTIC_URL}:${ELASTIC_PORT}`;

// Keep track of all clients we create, so we can close them on shutdown
const clients = [];

function createElasticClient(options = {}) {
  // Use either a real Elastic Client or a Mock instance, depending on env setting
  let client;

  // Set MOCK_ELASTIC=1 to mock, MOCK_ELASTIC= to use real elastic
  if (process.env.MOCK_ELASTIC) {
    mock = mock || new Mock();
    client = new MockClient(options);
    client.mock = mock;
  } else {
    client = new Client({ ...options, node: elasticUrl });
  }

  clients.push(client);
  return client;
}

module.exports.Elastic = createElasticClient;

// Quit all connections gracefully
module.exports.shutDown = () =>
  Promise.all(
    clients.map(async (client) => {
      try {
        await client.close();
      } catch (err) {
        logger.debug({ err }, 'unable to close elasticsearch connection');
      }
    })
  );
