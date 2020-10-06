const dotenv = require('dotenv');
const { logger } = require('../utils/logger');

const result = dotenv.config();

if (result.error && logger) {
  logger.error(
    '\n\n\t💡  It appears that you have not yet configured a .env file.',
    '\n\t   Please refer to our documentation regarding environment configuration:',
    '\n\t   https://github.com/Seneca-CDOT/telescope/blob/master/docs/CONTRIBUTING.md\n'
  );
}
