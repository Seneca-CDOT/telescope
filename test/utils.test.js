const utils = require('../src/utils');

test('Test for valid URL', () => {
  expect(utils.isValidUrl('https://github.com/Seneca-CDOT/telescope/issues/74')).toBe(true);
});

test('Test for invalid URL: missing protocol', () => {
  expect(utils.isValidUrl('github.com/Seneca-CDOT/telescope/issues/74')).toBe(false);
});

test('Test for invalid URL: missing colon (:)', () => {
  expect(utils.isValidUrl('https//github.com/Seneca-CDOT/telescope/issus/74')).toBe(false);
});
