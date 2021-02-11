/* global describe, test, beforeEach, afterEach, expect */
const fetch = require('node-fetch');
const getPort = require('get-port');

const { Satellite, logger } = require('.');

const createSatelliteInstance = (options) => {
  const service = new Satellite(options || { name: 'test' });

  // Default route
  service.router.get('/always-200', (req, res) => {
    res.status(200).end();
  });

  return service;
};

describe('Satellite()', () => {
  let port;
  let port2;
  let url;
  let service;

  beforeEach(async () => {
    port = await getPort();
    port2 = await getPort();
    url = `http://localhost:${port}`;
    service = createSatelliteInstance();

    // Silence the logger.  Override if you need it in a test
    logger.level = 'silent';
  });

  afterEach((done) => {
    service.stop(done);
  });

  test('Should throw if Satellite() options missing name', () => {
    expect(() => new Satellite()).toThrow();
  });

  test('Should not throw if Satellite() options has name', () => {
    expect(() => new Satellite({ name: 'test' })).not.toThrow();
  });

  test('start() should throw if port not defined', () => {
    expect(() => service.start()).toThrow();
  });

  test('Satellite() instance should have /healthcheck', (done) => {
    service.start(port, async () => {
      const res = await fetch(`${url}/healthcheck`);
      expect(res.ok).toBe(true);
      done();
    });
  });

  test('start() should throw if called twice', (done) => {
    service.start(port, () => {
      expect(() => service.start(port2, async () => {})).toThrow();
      done();
    });
  });

  test('Satellite() should allow adding routes to the default router', (done) => {
    service.start(port, async () => {
      const res = await fetch(`${url}/always-200`);
      expect(res.status).toBe(200);
      done();
    });
  });

  describe('cors', () => {
    test('CORS set by default', (done) => {
      service.start(port, async () => {
        const res = await fetch(`${url}/always-200`, { credentials: 'same-origin' });
        expect(res.ok).toBe(true);
        expect(res.headers.get('access-control-allow-origin')).toBe('*');
        done();
      });
    });

    test('Allow disabling CORS', (done) => {
      const corsService = createSatelliteInstance({ name: 'test', port, cors: false });
      corsService.start(port, async () => {
        const res = await fetch(`${url}/always-200`, { credentials: 'same-origin' });
        expect(res.ok).toBe(true);
        expect(res.headers.get('access-control-allow-origin')).toBe(null);
        corsService.stop(done);
      });
    });

    test('Allow passing options to CORS', (done) => {
      const origin = 'http://example.com';
      const corsService = createSatelliteInstance({ name: 'test', port, cors: { origin } });
      corsService.start(port, async () => {
        const res = await fetch(`${url}/always-200`, { credentials: 'same-origin' });
        expect(res.ok).toBe(true);
        expect(res.headers.get('access-control-allow-origin')).toBe('http://example.com');
        corsService.stop(done);
      });
    });
  });

  describe('helmet', () => {
    test('helmet on by default', (done) => {
      service.start(port, async () => {
        const res = await fetch(`${url}/always-200`);
        expect(res.ok).toBe(true);
        expect(res.headers.get('x-xss-protection')).toBe('0');
        done();
      });
    });

    test('Allow disabling helmet', (done) => {
      const helmetService = createSatelliteInstance({ name: 'test', port, helmet: false });
      helmetService.start(port, async () => {
        const res = await fetch(`${url}/always-200`);
        expect(res.ok).toBe(true);
        expect(res.headers.get('x-xss-protection')).toBe(null);
        helmetService.stop(done);
      });
    });

    test('Allow passing options to helmet', (done) => {
      const helmetService = createSatelliteInstance({
        name: 'test',
        port,
        helmet: { xssFilter: false },
      });
      helmetService.start(port, async () => {
        const res = await fetch(`${url}/always-200`);
        expect(res.ok).toBe(true);
        expect(res.headers.get('x-xss-protection')).toBe(null);
        helmetService.stop(done);
      });
    });
  });

  test('the default README example code should work', (done) => {
    // Add your routes to the service's router
    service.router.get('/my-route', (req, res) => {
      res.json({ message: 'hello world' });
    });

    const testRoute = async () => {
      const res = await fetch(`${url}/my-route`);
      expect(res.ok).toBe(true);
      const body = await res.json();
      expect(body).toEqual({ message: 'hello world' });

      service.stop(done);
    };

    service.start(port, () => {
      logger.info('Here we go!');
      testRoute();
    });
  });
});

describe('logger', () => {
  test('logger should have expected methods()', () => {
    ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].forEach((level) => {
      expect(typeof logger[level] === 'function').toBe(true);
      expect(() => logger[level]('test')).not.toThrow();
    });
  });
});
