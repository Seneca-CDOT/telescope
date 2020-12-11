const { ELASTIC_URL, ELASTIC_PORT } = process.env;
const { Client } = require('@elastic/elasticsearch');
const Mock = require('@elastic/elasticsearch-mock');
const { logger } = require('../utils/logger');
const parseUrl = require('../utils/url-parser');

function MockClient(options) {
  const mock = new Mock();
  options.Connection = mock.getConnection();
  // Mock out various responses we'll need:
  mock.add(
    {
      method: ['PUT', 'POST', 'GET', 'DELETE'],
      path: '/posts/post/:post_id',
    },
    () => {
      return { status: 'ok' };
    }
  );

  const client = new Client(options);
  // Provide a fake health check
  client.cluster.health = () => Promise.resolve();

  return client;
}

// Set MOCK_ELASTIC=1 to mock, MOCK_ELASTIC= to use real elastic
const useMockElastic = process.env.MOCK_ELASTIC;

// Use either a real Elastic Client or a Mock instance, depending on env setting
const ElasticConstructor = useMockElastic ? MockClient : Client;

function createElasticClient() {
  try {
    const elasticUrl = parseUrl(ELASTIC_URL, ELASTIC_PORT) || 'http://localhost:9200';
    return new ElasticConstructor({ node: elasticUrl });
  } catch (error) {
    const message = `Unable to parse elastic URL "${ELASTIC_URL}" and/or PORT "${ELASTIC_PORT}"`;
    logger.error({ error }, message);
    throw new Error(message);
  }
}

module.exports = {
  // In case callers need to create a new elastic client
  createElasticClient,
  // Otherwise they can use this shared instance (most should use this)
  client: createElasticClient(),
};
