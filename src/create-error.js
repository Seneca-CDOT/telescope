const _createError = require('http-errors');
const { errors } = require('@elastic/elasticsearch');

module.exports = (...args) => {
  let status;
  let argToSend;
  let props = {};
  for (let i = 0; i < args.length; i++) {
    let arg = args[i];
    let type = typeof arg;
    // Deal with ElasticSearch Error objects
    if (type === 'object' && arg instanceof errors.ResponseError) {
      argToSend = _createError(arg.statusCode, `ElasticSearch Error:${arg.name}`, arg.meta);
    }
    // Get the status code if the status code is a number and is the first argument
    // This follows how http-errors deals with status codes
    // https://github.com/jshttp/http-errors/blob/206aa2c15635dc1212c06c279540972aa90e23ea/index.js#L61-L62
    else if (type === 'number' && i === 0) {
      status = arg;
    }
    // If it is not an Error object nor an ES Error object, it will be added as an Error property
    // This follows how http-errors deals with non Error objects
    // https://github.com/jshttp/http-errors/blob/206aa2c15635dc1212c06c279540972aa90e23ea/index.js#L65-L66
    else if (type === 'object' && !(arg instanceof Error)) {
      props = arg;
    }
    // Everything else is sent through normally, to be filtered by http-errors
    else {
      argToSend = arg;
    }
  }
  return _createError(status, argToSend, props);
};
