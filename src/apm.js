// This needs to go first so it can instrument the app
// https://www.elastic.co/guide/en/apm/agent/nodejs/current/express.html
// To use, set the following environment variables:
//
// - ELASTIC_APM_SERVICE_NAME: the name of your service as it will appear in APM
// - ELASTIC_APM_SERVER_URL: the URL to the APM server (e.g., http://localhost:8200)
let apm = null;

// Only do this if we have an APM server config to work with.
if (
  process.env.ELASTIC_APM_SERVER_URL &&
  process.env.ELASTIC_APM_SERVICE_NAME
) {
  apm = require("elastic-apm-node").start({
    centralConfig: false,
  });
}

module.exports = apm;
