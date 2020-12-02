const urlParser = require('../src/backend/utils/url-parser');

describe('url-parser tests', () => {
  const testUrlWithPort = 'http://127.0.0.1:9200';
  const testUrlWithoutPort = 'http://127.0.0.1';
  const testport = '9200';
  const expectedReturn1 = 'http://127.0.0.1:9200/';
  const expectedReturn2 = 'http://127.0.0.1/';

  test('urlParser with double ports', () => {
    const result = urlParser(testUrlWithPort, testport);
    expect(result).toBe(expectedReturn1);
  });

  test('urlParser with 1 string port', () => {
    const result = urlParser(testUrlWithoutPort, testport);
    expect(result).toBe(expectedReturn1);
  });

  test('urlParser with invalid url', () => {
    const result = urlParser('', testport);
    expect(result).toBe(null);
  });

  test('urlParser with url with no port and no port', () => {
    const result = urlParser(testUrlWithoutPort);
    expect(result).toBe(expectedReturn2);
  });

  test('urlPaser with port being a null value', () => {
    const result = urlParser(testUrlWithoutPort, null);
    expect(result).toBe(expectedReturn2);
  });

  test('urlPaser with port being an integer', () => {
    const result = urlParser(testUrlWithoutPort, Number(testport));
    expect(result).toBe(expectedReturn1);
  });

  test('urlPaser with port being an invalid string', () => {
    const result = urlParser(testUrlWithoutPort, 'invalid');
    expect(result).toBe(expectedReturn2);
  });
  test('urlPaser with an out of range port', () => {
    const result = urlParser(testUrlWithoutPort, 999999);
    expect(result).toBe(expectedReturn2);
  });
});
