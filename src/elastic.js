const { ELASTIC_URL, ELASTIC_PORT } = process.env;
const { Client } = require('@elastic/elasticsearch');
const Mock = require('@elastic/elasticsearch-mock');

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
  const elasticUrl = `${ELASTIC_URL}:${ELASTIC_PORT}`;
  return new ElasticConstructor({ node: elasticUrl });
}

module.exports = createElasticClient;
