const path = require('path');
const result = require('dotenv').config({ path: path.join(__dirname, '../env.development') });

if (result.error) {
  throw result.error;
}
