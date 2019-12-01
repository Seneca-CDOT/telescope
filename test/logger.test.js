const { logger } = require('../src/backend/utils/logger');

// This test helps determine whether the type of
// logger methods are functions

test('logger.methods to be functions', () => {
  expect(typeof logger.debug).toBe('function');
  expect(typeof logger.info).toBe('function');
  expect(typeof logger.child).toBe('function');
  expect(typeof logger.error).toBe('function');
  expect(typeof logger.trace).toBe('function');
  expect(typeof logger.warn).toBe('function');
  expect(typeof logger.fatal).toBe('function');
});
