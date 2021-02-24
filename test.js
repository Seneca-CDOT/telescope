/* global describe, test, beforeEach, afterEach, expect */
const fetch = require("node-fetch");
const getPort = require("get-port");
const jwt = require("jsonwebtoken");

// Tests cause terminus to leak warning on too many listeners, increase a bit
require("events").EventEmitter.defaultMaxListeners = 32;

const {
  Satellite,
  Router,
  ProtectedRouter,
  protectWithJwt,
  logger,
  hash,
} = require(".");
const { JWT_EXPIRES_IN, JWT_ISSUER, JWT_AUDIENCE, SECRET } = process.env;

const createSatelliteInstance = (options) => {
  const service = new Satellite(options || { name: "test" });

  // Default route
  service.router.get("/always-200", (req, res) => {
    res.status(200).end();
  });

  return service;
};

const createToken = (user, secret = SECRET) => {
  return jwt.sign(
    {
      // The token is issued by us (e.g., this server)
      iss: JWT_ISSUER,
      // It is intended for the services running at this api origin
      aud: JWT_AUDIENCE,
      // The subject of this token, the user
      sub: user,
      // TODO: role info (e.g., admin)
    },
    secret,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

describe("Satellite()", () => {
  let port;
  let port2;
  let url;
  let service;
  let token;

  beforeEach(async () => {
    port = await getPort();
    port2 = await getPort();
    url = `http://localhost:${port}`;
    service = createSatelliteInstance();

    // Silence the logger.  Override if you need it in a test
    logger.level = "silent";

    // Create a JWT bearer token we can use if necessary
    token = createToken("test-user@email.com");
  });

  afterEach((done) => {
    service.stop(done);
    service = null;
  });

  test("start() should throw if port not defined", () => {
    expect(() => service.start()).toThrow();
  });

  describe("/healthcheck", () => {
    test("Satellite() instance should have /healthcheck", (done) => {
      service.start(port, async () => {
        const res = await fetch(`${url}/healthcheck`);
        expect(res.ok).toBe(true);
        done();
      });
    });

    test("Satellite() should use provided healthCheck function, and fail if rejected", (done) => {
      const service = createSatelliteInstance({
        name: "test",
        healthCheck() {
          return Promise.reject(new Error("sorry, service unavailable"));
        },
      });
      service.start(port, async () => {
        const res = await fetch(`${url}/healthcheck`);
        console.log(res);
        expect(res.ok).toBe(false);
        service.stop(done);
      });
    });

    test("Satellite() should use provided healthCheck function, and pass if resolved", (done) => {
      const service = createSatelliteInstance({
        name: "test",
        healthCheck() {
          return Promise.resolve("ok");
        },
      });
      service.start(port, async () => {
        const res = await fetch(`${url}/healthcheck`);
        console.log(res);
        expect(res.ok).toBe(true);
        service.stop(done);
      });
    });
  });

  test("start() should throw if called twice", (done) => {
    service.start(port, () => {
      expect(() => service.start(port2, async () => {})).toThrow();
      done();
    });
  });

  test("Satellite() should allow adding routes to the default router", (done) => {
    service.start(port, async () => {
      const res = await fetch(`${url}/always-200`);
      expect(res.status).toBe(200);
      done();
    });
  });

  test("Satellite() should allow adding middleware with beforeRouter", (done) => {
    const service = createSatelliteInstance({
      name: "test",
      beforeRouter(app) {
        app.use((req, res, next) => {
          req.testValue = "test";
          next();
        });
      },
    });
    service.router.get("/test-value", (req, res) =>
      res.json({ testValue: req.testValue })
    );
    service.start(port, async () => {
      const res = await fetch(`${url}/test-value`);
      expect(res.ok).toBe(true);
      const body = await res.json();
      expect(body).toEqual({ testValue: "test" });
      service.stop(done);
    });
  });

  test("Satellite() should allow passing a router to the constructor", (done) => {
    const router = Router();
    router.get("/test-value", (req, res) => res.json({ hello: "world" }));

    const service = createSatelliteInstance({
      name: "test",
      router,
    });

    expect(service.router).toEqual(router);

    service.start(port, async () => {
      const res = await fetch(`${url}/test-value`);
      expect(res.ok).toBe(true);
      const body = await res.json();
      expect(body).toEqual({ hello: "world" });
      service.stop(done);
    });
  });

  test("Satellite() should allow adding middleware with beforeParsers", (done) => {
    const service = createSatelliteInstance({
      name: "test",
      beforeParsers(app) {
        app.use((req, res, next) => {
          req.testValue = "test";
          next();
        });
      },
    });
    service.router.get("/test-value", (req, res) =>
      res.json({ testValue: req.testValue })
    );
    service.start(port, async () => {
      const res = await fetch(`${url}/test-value`);
      expect(res.ok).toBe(true);
      const body = await res.json();
      expect(body).toEqual({ testValue: "test" });
      service.stop(done);
    });
  });

  test("Satellite() should allow adding middleware with beforeParsers and beforeRouter together", (done) => {
    const service = createSatelliteInstance({
      name: "test",
      beforeParsers(app) {
        app.use((req, res, next) => {
          req.testValue = "parsers";
          next();
        });
      },
      beforeRouter(app) {
        app.use((req, res, next) => {
          req.testValue += "-router";
          next();
        });
      },
    });
    service.router.get("/test-value", (req, res) =>
      res.json({ testValue: req.testValue })
    );
    service.start(port, async () => {
      const res = await fetch(`${url}/test-value`);
      expect(res.ok).toBe(true);
      const body = await res.json();
      expect(body).toEqual({ testValue: "parsers-router" });
      service.stop(done);
    });
  });

  test("Satellite() should provide a default favicon at /favicon.ico", (done) => {
    service.start(port, async () => {
      const res = await fetch(`${url}/favicon.ico`);
      expect(res.ok).toBe(true);
      expect(res.headers.get("content-type")).toEqual("image/x-icon");
      service.stop(done);
    });
  });

  test("Satellite() should protect the app if protected is true", (done) => {
    const service = createSatelliteInstance({
      name: "test",
      protected: true,
    });

    const router = service.router;
    router.get("/should-be-protected", (req, res) =>
      res.json({ hello: "protected" })
    );

    service.start(port, async () => {
      // Protected should fail without authorization header
      let res = await fetch(`${url}/should-be-protected`);
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(401);

      // Protected should work with authorization header
      res = await fetch(`${url}/should-be-protected`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      expect(res.ok).toBe(true);
      body = await res.json();
      expect(body).toEqual({ hello: "protected" });

      service.stop(done);
    });
  });

  test("Satellite() should not provide the default favicon if disableFavicon:true in options", (done) => {
    const service = createSatelliteInstance({
      name: "test",
      disableFavicon: true,
    });
    service.start(port, async () => {
      const res = await fetch(`${url}/favicon.ico`);
      expect(res.ok).toBe(false);
      service.stop(done);
    });
  });

  describe("Router()", () => {
    test("should be able to create sub-routers using Router()", (done) => {
      const customRouter = Router();
      customRouter.get("/sub-router", (req, res) => {
        res.status(200).end();
      });

      service.router.use("/router", customRouter);

      const testRoute = async () => {
        const res = await fetch(`${url}/router/sub-router`);
        expect(res.ok).toBe(true);
        service.stop(done);
      };

      service.start(port, () => {
        logger.info("Here we go!");
        testRoute();
      });
    });
  });

  test("protectJWT should work on a specific route", (done) => {
    const service = createSatelliteInstance({
      name: "test",
    });

    const router = service.router;
    router.get("/public", (req, res) => res.json({ hello: "public" }));
    router.get("/protected", protectWithJwt(), (req, res) => {
      // Make sure the user payload was added to req
      expect(req.user.sub).toEqual("test-user@email.com");
      res.json({ hello: "protected" });
    });

    service.start(port, async () => {
      // Public should need no bearer token
      let res = await fetch(`${url}/public`);
      expect(res.ok).toBe(true);
      let body = await res.json();
      expect(body).toEqual({ hello: "public" });

      // Protected should fail without authorization header
      res = await fetch(`${url}/protected`);
      expect(res.ok).toBe(false);
      expect(res.status).toEqual(401);

      // Protected should work with authorization header
      res = await fetch(`${url}/protected`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      expect(res.ok).toBe(true);
      body = await res.json();
      expect(body).toEqual({ hello: "protected" });

      service.stop(done);
    });
  });

  describe("ProtectedRouter()", () => {
    test("should be able to create a protected sub-router using ProtectedRouter()", (done) => {
      const customRouter = ProtectedRouter();
      customRouter.get("/sub-router", (req, res) => {
        res.status(200).end();
      });

      service.router.use("/router", customRouter);

      const testRoute = async () => {
        const res = await fetch(`${url}/router/sub-router`, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
        expect(res.ok).toBe(true);
        service.stop(done);
      };

      service.start(port, () => {
        logger.info("Here we go!");
        testRoute();
      });
    });

    test("should expect routes on ProtectedRouter to be protected", (done) => {
      const customRouter = ProtectedRouter();
      customRouter.get("/sub-router", (req, res) => {
        res.status(200).end();
      });

      service.router.use("/router", customRouter);

      const testRoute = async () => {
        // Include a bearer token, but not a correct one for our system
        const res = await fetch(`${url}/router/sub-router`, {
          headers: {
            Authorization: `bearer ${createToken(
              "test-user@email.com",
              "different-secret"
            )}`,
          },
        });
        expect(res.ok).toBe(false);
        expect(res.status).toEqual(401);
        service.stop(done);
      };

      service.start(port, () => {
        logger.info("Here we go!");
        testRoute();
      });
    });

    test("should expect protected routes to not be fooled by wrong, but valid token", (done) => {
      const customRouter = ProtectedRouter();
      customRouter.get("/sub-router", (req, res) => {
        res.status(200).end();
      });

      service.router.use("/router", customRouter);

      const testRoute = async () => {
        // Don't include a bearer token
        const res = await fetch(`${url}/router/sub-router`);
        expect(res.ok).toBe(false);
        expect(res.status).toEqual(401);
        service.stop(done);
      };

      service.start(port, () => {
        logger.info("Here we go!");
        testRoute();
      });
    });
  });

  describe("Default body parsers", () => {
    test("should support JSON body", (done) => {
      service.router.post("/json", (req, res) => {
        // echo back the json body
        res.json(req.body);
      });
      service.start(port, async () => {
        const res = await fetch(`${url}/json`, {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ json: "rocks" }),
        });
        expect(res.ok).toBe(true);
        const data = await res.json();
        expect(data).toEqual({ json: "rocks" });
        done();
      });
    });

    test("should support x-www-form-urlencoded body", (done) => {
      service.router.post("/form", (req, res) => {
        // echo back the body
        res.json(req.body);
      });
      service.start(port, async () => {
        const res = await fetch(`${url}/form`, {
          method: "post",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: "json=rocks",
        });
        expect(res.ok).toBe(true);
        const data = await res.json();
        expect(data).toEqual({ json: "rocks" });
        done();
      });
    });
  });

  test("the default README example code should work", (done) => {
    // Add your routes to the service's router
    service.router.get("/my-route", (req, res) => {
      res.json({ message: "hello world" });
    });

    const testRoute = async () => {
      const res = await fetch(`${url}/my-route`);
      expect(res.ok).toBe(true);
      const body = await res.json();
      expect(body).toEqual({ message: "hello world" });

      service.stop(done);
    };

    service.start(port, () => {
      logger.info("Here we go!");
      testRoute();
    });
  });

  describe("cors", () => {
    test("CORS set by default", (done) => {
      service.start(port, async () => {
        const res = await fetch(`${url}/always-200`, {
          credentials: "same-origin",
        });
        expect(res.ok).toBe(true);
        expect(res.headers.get("access-control-allow-origin")).toBe("*");
        done();
      });
    });

    test("Allow disabling CORS", (done) => {
      const corsService = createSatelliteInstance({
        name: "test",
        port,
        cors: false,
      });
      corsService.start(port, async () => {
        const res = await fetch(`${url}/always-200`, {
          credentials: "same-origin",
        });
        expect(res.ok).toBe(true);
        expect(res.headers.get("access-control-allow-origin")).toBe(null);
        corsService.stop(done);
      });
    });

    test("Allow passing options to CORS", (done) => {
      const origin = "http://example.com";
      const corsService = createSatelliteInstance({
        name: "test",
        port,
        cors: { origin },
      });
      corsService.start(port, async () => {
        const res = await fetch(`${url}/always-200`, {
          credentials: "same-origin",
        });
        expect(res.ok).toBe(true);
        expect(res.headers.get("access-control-allow-origin")).toBe(
          "http://example.com"
        );
        corsService.stop(done);
      });
    });
  });

  describe("helmet", () => {
    test("helmet on by default", (done) => {
      service.start(port, async () => {
        const res = await fetch(`${url}/always-200`);
        expect(res.ok).toBe(true);
        expect(res.headers.get("x-xss-protection")).toBe("0");
        done();
      });
    });

    test("Allow disabling helmet", (done) => {
      const helmetService = createSatelliteInstance({
        name: "test",
        port,
        helmet: false,
      });
      helmetService.start(port, async () => {
        const res = await fetch(`${url}/always-200`);
        expect(res.ok).toBe(true);
        expect(res.headers.get("x-xss-protection")).toBe(null);
        helmetService.stop(done);
      });
    });

    test("Allow passing options to helmet", (done) => {
      const helmetService = createSatelliteInstance({
        name: "test",
        port,
        helmet: { xssFilter: false },
      });
      helmetService.start(port, async () => {
        const res = await fetch(`${url}/always-200`);
        expect(res.ok).toBe(true);
        expect(res.headers.get("x-xss-protection")).toBe(null);
        helmetService.stop(done);
      });
    });
  });
});

describe("logger", () => {
  test("logger should have expected methods()", () => {
    ["trace", "debug", "info", "warn", "error", "fatal"].forEach((level) => {
      expect(typeof logger[level] === "function").toBe(true);
      expect(() => logger[level]("test")).not.toThrow();
    });
  });
});

describe("hash function tests for satellite", () => {
  it("should return a 10 character hash value", () => {
    expect(hash("satellite").length).toBe(10);
  });

  it("should hash a string correctly", () => {
    expect(hash("satellite")).toBe("dc4b4e203f");
  });

  it("should return a different hash if anything changes", () => {
    expect(hash("satellite2")).toBe("6288d4ca65");
  });
});
