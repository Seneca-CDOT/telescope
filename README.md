# Satellite

![node-js-ci](https://github.com/Seneca-CDOT/satellite/workflows/node-js-ci/badge.svg)

A Microservice Framework for [Telescope](https://github.com/Seneca-CDOT/telescope).
Because Ray said we should try microservices!

Satellite creates an [Express.js](http://expressjs.com/) based server with
various common pieces already set up. Bring your own router and let us do the rest.

## Install

```
npm install --save @telescope/satellite
```

## Configure

You need to set the following environment variables if you want Elastic APM
monitoring for your service:

- `ELASTIC_APM_SERVER_URL`: the URL to the APM server (e.g., http://localhost:8200)
- `ELASTIC_APM_SERVICE_NAME`: the name of the service as it will appear in APM

If you don't provide these values in your environment, APM monitoring will be
disabled.

## Usage

```js
// Get the Satellite constructor and logger.  NOTE: `Router` is also exposed
// in case you need to create a sub-router: `const router = new Router();`
// The `Router` constructor is the same as using `express.Router()`;
const { Satellite, logger } = require("@senecacdot/satellite");

// Define your microservice, providing some options (see below)
const service = new Satellite({
  beforeRouter(app) {
    // Optionally add some middleware before the router is attached
    app.use(middlewareFunction());
  },
});

// Add your routes to the service's router
service.router.get("/my-route", (req, res) => {
  res.json({ message: "hello world" });
});

// Start the service on the specified port
service.start(8888, () => {
  logger.info("Here we go!");
});
```

### `Satellite(options)`

- `healthCheck`: an optional `function` returning a `Promise`, used to determine if the service is healthy. If no function is defined, a default one will be provided. The `healthCheck` function is what runs at the `/healthcheck` route by default.

- `cors`: the options to pass to the [cors](https://www.npmjs.com/package/cors) middleware. By default all options are turned on. Use `cors: false` to disable cors.

- `helmet`: the options to pass to the [helmet](https://www.npmjs.com/package/helmet) middleware. By default all options are turned on. Use `helmet: false` to disable helmet.

- `beforeParsers`: an optional function that allows access to the `app` during creation prior to adding the body parsers

- `beforeRouter`: an optional function that allows access to the `app` during creation prior to adding the router.

- `router`: an optional router to use in place of the default one created automatically.
