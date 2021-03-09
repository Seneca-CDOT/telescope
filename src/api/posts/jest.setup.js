const path = require('path');
const result = require('dotenv').config({
  path: path.join(__dirname, '../env.development'),
});

process.env = { ...process.env, MOCK_REDIS: '1' };

if (result.error) {
  throw result.error;
}
