const pino = require("pino");

const usingElastic =
  process.env.ELASTIC_APM_SERVER_URL && process.env.ELASTIC_APM_SERVICE_NAME;

// Pick our logger based on whether we're using APM monitoring with ELK
let logger = usingElastic
  ? // Structured JSON logging
    pino(require("@elastic/ecs-pino-format")({ convertReqRes: true }))
  : // Pretty debug logging
    pino({
      prettyPrint: {},
      prettifier: require("pino-colada"),
    });

module.exports = logger;
